#!/usr/bin/env python3
"""
Sync the three Notion databases of the AI-Assisted Decision-Making framework
into a single static JSON file for the website.

Usage
-----
    export NOTION_TOKEN=secret_xxx
    python scripts/sync_notion.py                    # write data/framework.json
    python scripts/sync_notion.py --check            # validate only, write nothing
    python scripts/sync_notion.py --out other.json

Design notes
------------
* Slugs are STABLE. They live in data/slugs.json, keyed by Notion page id, and are
  never regenerated once assigned. Rewording a mechanism claim will not break a URL.
  Seed that file from your existing export the first time (see --seed-slugs).
* Relations are resolved to slugs. Any relation pointing at a page that is not in the
  live export (i.e. a page in the Notion trash) is reported as a DANGLING RELATION.
  With --check this makes the run fail, which is what you want in CI.
* Nothing is invented. Fields the website needs that Notion does not hold are read
  from data/overlay.json and merged in by slug.

Requires: requests  (pip install requests)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import unicodedata
from pathlib import Path
from typing import Any

import requests

# --------------------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------------------

NOTION_VERSION = "2022-06-28"  # pin: 2025-xx versions restructure databases into data sources
API = "https://api.notion.com/v1"

DATABASES = {
    "studies":    "8d6bcfe05aa943a7ae89ba583c9166e9",  # Framework Evidence Base
    "mechanisms": "d964826bbbc44c4ca6e57c5824c79aeb",  # Mechanisms
    "factors":    "87b753dc1660423ebf9aa58ef5772aff",  # Factors
}

FRAMEWORK_PAGE = "https://app.notion.com/p/38f7da29e21381e19884f0b8be8f1533"

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SLUGS_PATH = DATA_DIR / "slugs.json"
OVERLAY_PATH = DATA_DIR / "overlay.json"
DEFAULT_OUT = DATA_DIR / "framework.json"

# Parent field -> (paired "levels manipulated" field, label used in manipulated_factors)
MANIPULATION_PAIRS = [
    ("Expertise level",         "Expertise levels manipulated",   "Expertise"),
    ("Team composition",        "Team levels manipulated",        "Team"),
    ("Difficulty",              "Difficulty levels manipulated",  "Difficulty"),
    ("Task uncertainty",        "Uncertainty levels manipulated", "Task uncertainty"),
    ("Stakes",                  "Stakes levels manipulated",      "Stakes"),
    ("Time constraint / stress", "Time/stress levels manipulated", "Time/stress"),
    ("AI design",               "AI design levels manipulated",   "AI design"),
]

CODING_FIELDS = {
    "expertise_level":  "Expertise level",
    "team_composition": "Team composition",
    "group_size":       "Group size",
    "group_mode":       "Group decision mode",
    "difficulty":       "Difficulty",
    "task_uncertainty": "Task uncertainty",
    "stakes":           "Stakes",
    "stress_time":      "Time constraint / stress",
    "ai_design":        "AI design",
    "xai_present":      "XAI present",
    "xai_type":         "XAI type",
    "xai_quality":      "XAI quality",
}


# --------------------------------------------------------------------------------------
# Notion property extraction
# --------------------------------------------------------------------------------------

def _plain(rich: list[dict]) -> str:
    return "".join(part.get("plain_text", "") for part in rich).strip()


def read_prop(prop: dict) -> Any:
    """Turn one Notion property object into a plain Python value."""
    kind = prop.get("type")
    if kind == "title":
        return _plain(prop["title"])
    if kind == "rich_text":
        return _plain(prop["rich_text"])
    if kind == "number":
        return prop["number"]
    if kind == "url":
        return prop["url"]
    if kind == "email":
        return prop["email"]
    if kind == "checkbox":
        return prop["checkbox"]
    if kind == "select":
        sel = prop["select"]
        return sel["name"] if sel else None
    if kind == "status":
        sel = prop["status"]
        return sel["name"] if sel else None
    if kind == "multi_select":
        return [o["name"] for o in prop["multi_select"]]
    if kind == "date":
        d = prop["date"]
        return d["start"] if d else None
    if kind == "relation":
        return [r["id"].replace("-", "") for r in prop["relation"]]
    if kind == "people":
        return [p.get("name") for p in prop["people"]]
    if kind == "formula":
        f = prop["formula"]
        return f.get(f.get("type"))
    if kind == "rollup":
        r = prop["rollup"]
        if r.get("type") == "number":
            return r.get("number")
        return None  # array rollups are derived locally instead
    return None


def read_page(page: dict) -> dict:
    out = {k: read_prop(v) for k, v in page["properties"].items()}
    out["_id"] = page["id"].replace("-", "")
    out["_url"] = page["url"]
    return out


# --------------------------------------------------------------------------------------
# API access
# --------------------------------------------------------------------------------------

def query_database(db_id: str, token: str) -> list[dict]:
    """Return every non-archived page of a database, following pagination."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }
    rows: list[dict] = []
    cursor: str | None = None
    while True:
        body: dict[str, Any] = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        for attempt in range(5):
            resp = requests.post(f"{API}/databases/{db_id}/query",
                                 headers=headers, json=body, timeout=30)
            if resp.status_code == 429:  # rate limited
                time.sleep(float(resp.headers.get("Retry-After", 1)) + 0.5)
                continue
            resp.raise_for_status()
            break
        else:
            raise RuntimeError(f"giving up on {db_id} after repeated rate limiting")

        payload = resp.json()
        rows.extend(p for p in payload["results"] if not p.get("in_trash") and not p.get("archived"))
        if not payload.get("has_more"):
            return rows
        cursor = payload["next_cursor"]
        time.sleep(0.35)  # stay under ~3 req/s


# --------------------------------------------------------------------------------------
# Stable slugs
# --------------------------------------------------------------------------------------

def slugify(text: str, maxlen: int = 48) -> str:
    text = unicodedata.normalize("NFKD", text or "").encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text[:maxlen].rstrip("-") or "untitled"


class SlugRegistry:
    """Assign a slug once per Notion page id, then never change it."""

    def __init__(self, path: Path):
        self.path = path
        self.map: dict[str, str] = json.loads(path.read_text("utf-8")) if path.exists() else {}
        self.new: list[str] = []

    def get(self, page_id: str, prefix: str, *candidates: str) -> str:
        if page_id in self.map:
            return self.map[page_id]
        base = next((c for c in candidates if c), page_id[:8])
        slug = f"{prefix}-{slugify(base)}"
        taken = set(self.map.values())
        if slug in taken:
            n = 2
            while f"{slug}-{n}" in taken:
                n += 1
            slug = f"{slug}-{n}"
        self.map[page_id] = slug
        self.new.append(slug)
        return slug

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self.map, indent=2, ensure_ascii=False) + "\n", "utf-8")


# --------------------------------------------------------------------------------------
# Normalisation
# --------------------------------------------------------------------------------------

def build_factor(row: dict, slug: str) -> dict:
    return {
        "id": slug,
        "notion_url": row["_url"],
        "factor": row.get("Factor"),
        "component": row.get("Component"),
        "type": row.get("Type"),
        "order": row.get("Order"),
        "definition": row.get("Definition"),
        "sub_factors": row.get("Sub-factors"),
        "mechanisms": row.get("Mechanisms") or [],  # ids, resolved later
    }


def build_mechanism(row: dict, slug: str) -> dict:
    return {
        "id": slug,
        "notion_url": row["_url"],
        "claim": row.get("Claim"),
        "component": row.get("Component"),
        "sub_factor": row.get("Sub-factor"),
        "affects": row.get("Affects") or [],
        "description": row.get("Description"),
        "factor": (row.get("Factor") or [None])[0],
        "supporting_studies": row.get("Supporting Studies") or [],
        "contradicting_studies": row.get("Contradicting Studies") or [],
    }


def build_study(row: dict, slug: str) -> dict:
    coding = {key: row.get(prop) for key, prop in CODING_FIELDS.items()}

    manipulated: list[str] = []
    for parent, paired, label in MANIPULATION_PAIRS:
        value = row.get(parent)
        is_manip = ("Manipulated" in value) if isinstance(value, list) else (value == "Manipulated")
        if not is_manip:
            continue
        levels = row.get(paired) or []
        manipulated.extend(f"{label}: {lvl}" for lvl in levels) if levels else \
            manipulated.append(f"{label}: manipulated (levels not discretised)")

    return {
        "id": slug,
        "notion_url": row["_url"],
        "study": row.get("Study"),
        "author": row.get("Author"),
        "year": row.get("Year"),
        "venue": row.get("Venue"),
        "link": row.get("Link"),
        "sample_size": row.get("Sample size (N)"),
        "decision_task_type": row.get("Decision task type") or [],
        "coding": coding,
        "manipulated_factors": manipulated,
        "outcomes_measured": row.get("Outcomes measured") or [],
        "supports_mechanisms": row.get("Supports mechanisms") or [],
        "contradicts_mechanisms": row.get("Contradicts mechanisms") or [],
        "research_questions": row.get("Research Questions"),
        "design_notes": row.get("Experimental Design"),
        "ai_accuracy_details": row.get("AI accuracy details"),
        "summary_of_findings": row.get("Summary of findings"),
        "authors_framing": row.get("Author's words"),
        "observations": row.get("Observations"),
    }


def resolve(ids: list[str], lookup: dict[str, str], where: str,
            dangling: list[str]) -> list[str]:
    out = []
    for page_id in ids:
        slug = lookup.get(page_id)
        if slug is None:
            dangling.append(f"{where} -> {page_id} (page not in export; likely in Notion trash)")
        else:
            out.append(slug)
    return out


# --------------------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description="Sync Notion framework databases to JSON.")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--check", action="store_true",
                    help="validate and report only; do not write files")
    ap.add_argument("--seed-slugs", type=Path,
                    help="seed the slug registry from a previous export JSON")
    args = ap.parse_args()

    token = os.environ.get("NOTION_TOKEN")
    if not token:
        print("ERROR: NOTION_TOKEN is not set.", file=sys.stderr)
        return 2

    slugs = SlugRegistry(SLUGS_PATH)

    # Optional one-off: keep the slugs your current site already links to.
    if args.seed_slugs:
        previous = json.loads(args.seed_slugs.read_text("utf-8"))
        for bucket in ("factors", "mechanisms", "studies"):
            for rec in previous.get(bucket, []):
                page_id = (rec.get("notion_url") or "").rstrip("/").split("/")[-1].split("?")[0]
                if page_id and rec.get("id"):
                    slugs.map.setdefault(page_id.replace("-", ""), rec["id"])
        print(f"seeded {len(slugs.map)} slugs from {args.seed_slugs.name}")

    print("fetching from Notion ...")
    raw = {name: [read_page(p) for p in query_database(db_id, token)]
           for name, db_id in DATABASES.items()}
    for name, rows in raw.items():
        print(f"  {name:<11} {len(rows):>3} rows")

    # Assign slugs
    factor_slug = {r["_id"]: slugs.get(r["_id"], "f", r.get("Factor")) for r in raw["factors"]}
    mech_slug = {r["_id"]: slugs.get(r["_id"], "m", r.get("Sub-factor"), r.get("Claim"))
                 for r in raw["mechanisms"]}
    study_slug = {r["_id"]: slugs.get(r["_id"], "s",
                                      f"{(r.get('Author') or '').split(',')[0]} {r.get('Year') or ''}")
                  for r in raw["studies"]}

    factors = [build_factor(r, factor_slug[r["_id"]]) for r in raw["factors"]]
    mechanisms = [build_mechanism(r, mech_slug[r["_id"]]) for r in raw["mechanisms"]]
    studies = [build_study(r, study_slug[r["_id"]]) for r in raw["studies"]]

    # Resolve relations, collecting anything that points at a deleted page
    dangling: list[str] = []
    for f in factors:
        f["mechanisms"] = resolve(f["mechanisms"], mech_slug, f"factor {f['id']}.mechanisms", dangling)
    for m in mechanisms:
        m["factor"] = factor_slug.get(m["factor"]) if m["factor"] else None
        m["supporting_studies"] = resolve(m["supporting_studies"], study_slug,
                                          f"mechanism {m['id']}.supporting", dangling)
        m["contradicting_studies"] = resolve(m["contradicting_studies"], study_slug,
                                             f"mechanism {m['id']}.contradicting", dangling)
        m["n_support"] = len(m["supporting_studies"])
        m["n_contradict"] = len(m["contradicting_studies"])
    for s in studies:
        s["supports_mechanisms"] = resolve(s["supports_mechanisms"], mech_slug,
                                           f"study {s['id']}.supports", dangling)
        s["contradicts_mechanisms"] = resolve(s["contradicts_mechanisms"], mech_slug,
                                              f"study {s['id']}.contradicts", dangling)

    # Reciprocity check: Notion duals should already agree, but verify rather than trust.
    asymmetric: list[str] = []
    by_mech = {m["id"]: m for m in mechanisms}
    for s in studies:
        for mid in s["supports_mechanisms"]:
            if s["id"] not in by_mech[mid]["supporting_studies"]:
                asymmetric.append(f"{s['id']} supports {mid}, not mirrored")
    for m in mechanisms:
        for sid in m["supporting_studies"]:
            study = next(x for x in studies if x["id"] == sid)
            if m["id"] not in study["supports_mechanisms"]:
                asymmetric.append(f"{m['id']} lists {sid}, not mirrored")

    # Editorial fields Notion does not hold
    overlay = json.loads(OVERLAY_PATH.read_text("utf-8")) if OVERLAY_PATH.exists() else {}
    for bucket, records in (("factors", factors), ("mechanisms", mechanisms), ("studies", studies)):
        patches = overlay.get(bucket, {})
        for rec in records:
            rec.update(patches.get(rec["id"], {}))

    factors.sort(key=lambda f: (f.get("component") or "", f.get("order") or 0))
    mechanisms.sort(key=lambda m: -m["n_support"])
    studies.sort(key=lambda s: (s.get("year") or 0, s.get("author") or ""))

    document = {
        "meta": {
            "title": "AI-Assisted Decision-Making — Framework Data",
            "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "source": "Notion project 'AI Assisted Decision-Making' (3 linked databases)",
            "source_url": FRAMEWORK_PAGE,
            "counts": {"factors": len(factors),
                       "mechanisms": len(mechanisms),
                       "studies": len(studies)},
            "structure": ("factors (framework nodes) <- mechanisms (directional claims) "
                          "<- studies (coded evidence). Mechanisms are the join: each names "
                          "one factor and lists supporting and contradicting studies."),
            "id_scheme": "Stable slugs held in data/slugs.json, assigned once per Notion page id.",
        },
        "components": overlay.get("components", []),
        "factors": factors,
        "mechanisms": mechanisms,
        "studies": studies,
    }

    # Report
    if dangling:
        print(f"\n!! {len(dangling)} DANGLING RELATION(S) - pointing at deleted Notion pages:")
        for d in dangling:
            print(f"   {d}")
    if asymmetric:
        print(f"\n!! {len(asymmetric)} ASYMMETRIC RELATION(S):")
        for a in asymmetric:
            print(f"   {a}")
    if slugs.new:
        print(f"\n   {len(slugs.new)} new slug(s): {', '.join(slugs.new)}")

    orphans = [m["id"] for m in mechanisms if not m["n_support"] and not m["n_contradict"]]
    if orphans:
        print(f"\n   note: mechanism(s) with no linked studies: {', '.join(orphans)}")
    missing_factor = [m["id"] for m in mechanisms if not m["factor"]]
    if missing_factor:
        print(f"   note: mechanism(s) with no factor: {', '.join(missing_factor)}")

    if args.check:
        print("\n--check: nothing written.")
        return 1 if (dangling or asymmetric) else 0

    args.out.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(document, indent=2, ensure_ascii=False) + "\n"
    unchanged = args.out.exists() and _same_but_for_timestamp(args.out.read_text("utf-8"), payload)
    if unchanged:
        print(f"\nno content change; {args.out.relative_to(ROOT)} left alone")
    else:
        args.out.write_text(payload, "utf-8")
        print(f"\nwrote {args.out.relative_to(ROOT)} "
              f"({len(payload) / 1024:.0f} KB, {len(studies)} studies, "
              f"{len(mechanisms)} mechanisms, {len(factors)} factors)")
    slugs.save()
    return 1 if dangling else 0


def _same_but_for_timestamp(old: str, new: str) -> bool:
    strip = lambda t: re.sub(r'"generated": "[^"]*"', "", t)
    return strip(old) == strip(new)


if __name__ == "__main__":
    sys.exit(main())
