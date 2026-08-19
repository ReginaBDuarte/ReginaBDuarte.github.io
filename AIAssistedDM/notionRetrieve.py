#!/usr/bin/env python3
"""
Pull the three Notion databases behind the AI-Assisted Decision-Making framework
(Factors, Mechanisms, Framework Evidence Base / Studies) and write them out as the
single static JSON the website reads: src/data/aidm-framework.json.

Usage
-----
    pip install requests
    export NOTION_TOKEN=secret_xxx        # a Notion internal integration token,
                                            # shared with all three databases
    python notionRetrieve.py               # writes ../src/data/aidm-framework.json
    python notionRetrieve.py --check       # validate only, write nothing
    python notionRetrieve.py --out other.json

Design notes
------------
* Slugs are STABLE. They live in data/slugs.json, keyed by Notion page id, and are
  never regenerated once assigned. Rewording a mechanism's claim will not break a URL.
  data/slugs.json already ships seeded from the 2026-08-05 export, so pages that still
  exist in Notion keep the ids the website already links to (src/pages/framework/study/
  [id].astro, etc). New pages get a fresh slug on first sync.
* Relations are resolved to slugs. Any relation pointing at a page that is not in the
  live export (i.e. a page in the Notion trash) is reported as a DANGLING RELATION.
  With --check this makes the run fail, which is what you want in CI.
* Nothing is invented. Several fields the website needs are not Notion properties at
  all (see FIELDS THE OVERLAY OWNS below) — they are read from data/overlay.json and
  merged in by slug. Anything missing from the overlay ships as null/absent and is
  reported at the end of the run, not silently guessed at.

FIELDS THE OVERLAY OWNS (verified against the live schema 2026-08-11 — none of these
are Notion properties on any of the three databases):
    factors:    gap_note
    mechanisms: notes
    studies:    read, own_work, incomplete, coding.need_for_cognition
    top-level:  meta.data_notes[], components[]

(factor.coverage, mechanism.status, and mechanism.direction — editorial tiers like "Well
evidenced" / "Above bar" / "Increases" — used to live here too. All three removed
2026-08-12 at Regina's request: she doesn't want that classification layer at all,
on-site or in the data. What's left to judge a mechanism by is its Notion "Description"
text plus n_support / n_contradict, and mechanisms are meant to be ordered by n_support
wherever they're listed — see the sort in main() below. mechanism.notes is still overlay-
owned and still in the data model, but nothing on the site renders it any more — the
Level 1 mechanism cards show mechanism.description (read straight from Notion) instead,
same "leave it in the data even though nothing reads it" treatment as factor.gap_note.)

(coding.ai_performance used to be overlay-only too — the Studies database had no property
for it as of 2026-08-11's first pass. A multi-select "AI accuracy" property was added to
the database shortly after and is now read directly, like the other coding fields.)

(2026-08-18: Regina expanded the evidence base — Factors 9 -> 10 (new "Number of AI
advisors" node, AI Ecosystem component), Mechanisms ~17 -> 22, Studies 35 -> 56. The
Studies database also grew four new coding properties (Advice stance, Advisor agreement,
Number of AI advisors, Interaction modality, each paired with a "... levels manipulated"
counterpart) — added to CODING_FIELDS/MANIPULATION_PAIRS below. Growth in row count alone
needs no code change, since every field here is read by property name, not by position or
count; only new *properties* do. Checked the full live schema of all three databases
against this file before making that call. The "Contradicting Studies" / "Contradicts
mechanisms" relation properties this file has always read do not exist anywhere in the
current schema (see the comment in build_mechanism) — kept in the output as empty lists
for compatibility rather than removed, since removing them would change the JSON shape
the site's TypeScript/Astro layer expects.)

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

# Database ids (not data source ids) — all three still have exactly one data source,
# so the pre-2025 /databases/{id}/query endpoint works directly.
DATABASES = {
    "studies":    "8d6bcfe05aa943a7ae89ba583c9166e9",  # Framework Evidence Base
    "mechanisms": "d964826bbbc44c4ca6e57c5824c79aeb",  # Mechanisms
    "factors":    "87b753dc1660423ebf9aa58ef5772aff",  # Factors
}

FRAMEWORK_PAGE = "https://app.notion.com/p/38f7da29e21381e19884f0b8be8f1533"

ROOT = Path(__file__).resolve().parent            # AIAssistedDM/
REPO_ROOT = ROOT.parent                            # site repo root
DATA_DIR = ROOT / "data"
SLUGS_PATH = DATA_DIR / "slugs.json"
OVERLAY_PATH = DATA_DIR / "overlay.json"
DEFAULT_OUT = REPO_ROOT / "src" / "data" / "aidm-framework.json"  # what the site imports

# Parent field -> (paired "levels manipulated" field, label used in manipulated_factors)
# Verified against the live Studies schema 2026-08-11. Two special cases where the
# "paired" field is not a separate property:
#   - XAI: "XAI type" is the multi-select that holds the actual manipulated categories
#     (there is no separate "XAI levels manipulated" field most other pairs have).
#   - AI accuracy: multi-select, self-paired. A manipulated study has "Manipulated" plus
#     the accuracy-bucket options actually used (e.g. "Manipulated", "95%-100%", "<60%")
#     all set on the *same* property, so parent == paired here. See the loop below —
#     "Manipulated" is filtered out of levels for every pair, so this falls out naturally.
#   - XAI quality: select, not multi-select, and there is no "XAI quality levels
#     manipulated" property in Notion at all — the paired name below deliberately points
#     at a property that doesn't exist. row.get(...) on a missing key returns None, which
#     the loop already treats as "no levels", so this safely always falls into the
#     "manipulated (levels not discretised)" branch. That's correct here: quality only
#     has two states (Correct/Incorrect), Notion has nowhere to record which one(s) a
#     study varied, so "manipulated, unspecified" is the honest thing to say.
# Label strings match src/lib/aidm.ts's PREFIX_TO_FACTOR map exactly — that map is the
# other half of this contract and isn't derived from Notion, so keep the two in sync by
# hand if either changes.
MANIPULATION_PAIRS = [
    ("Expertise level",          "Expertise levels manipulated",   "Expertise"),
    ("Team composition",         "Team levels manipulated",        "Team"),
    ("Difficulty",               "Difficulty levels manipulated",  "Difficulty"),
    ("Task uncertainty",         "Uncertainty levels manipulated", "Uncertainty"),
    ("Stakes",                   "Stakes levels manipulated",      "Stakes"),
    ("Time constraint / stress", "Time/stress levels manipulated", "Time"),
    ("AI accuracy",              "AI accuracy",                    "AI performance"),
    ("AI design",                "AI design levels manipulated",   "AI design"),
    ("XAI present",              "XAI type",                       "XAI"),
    ("XAI quality",              "XAI quality levels manipulated", "XAI quality"),
    # Four pairs added 2026-08-18: the Studies database grew a new "Number of AI
    # advisors" factor (second-opinion / multi-advisor mechanisms) plus two new
    # coding dimensions on the existing AI design factor (advice stance, interaction
    # modality). Confirmed against the live schema and against each factor's
    # "Sub-factors" text in Notion, which now spells out the property name in
    # parentheses next to the sub-factor it belongs to (e.g. AI design's sub-factors
    # include "advice stance (Advice stance: directive ... against reflective ...)").
    ("Advice stance",            "Stance levels manipulated",      "Advice stance"),
    ("Advisor agreement",        "Agreement levels manipulated",   "Advisor agreement"),
    ("Number of AI advisors",    "Advisor count levels manipulated", "Advisor count"),
    ("Interaction modality",     "Modality levels manipulated",    "Interaction modality"),
]

CODING_FIELDS = {
    "expertise_level":  "Expertise level",
    "team_composition": "Team composition",
    "group_size":       "Group size",
    "group_mode":       "Group decision mode",
    "difficulty":       "Difficulty",
    "task_uncertainty": "Task uncertainty",
    "stakes":            "Stakes",
    "stress_time":       "Time constraint / stress",
    "ai_performance":    "AI accuracy",
    "ai_design":         "AI design",
    "xai_present":       "XAI present",
    "xai_type":          "XAI type",
    "xai_quality":       "XAI quality",
    # Four fields added 2026-08-18, alongside the MANIPULATION_PAIRS entries above —
    # see the comment there for why. Labels here match src/lib/aidm.ts's StudyCoding
    # interface field names; keep the two in sync by hand, same as everywhere else in
    # this file that duplicates a contract into the TypeScript side.
    "advice_stance":      "Advice stance",
    "advisor_agreement":  "Advisor agreement",
    "number_of_advisors": "Number of AI advisors",
    "interaction_modality": "Interaction modality",
    # No "need_for_cognition" here: Notion has no such property. It is filled in from
    # data/overlay.json's per-study "need_for_cognition" field after the fact — see
    # apply_study_overlay_coding().
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


def _coding_display(value: Any) -> Any:
    """Multi-select coding properties (AI design, XAI type, AI accuracy) come back as
    lists. Join them into the same ' · ' chip-separated string the rest of the site uses
    (see splitSubFactors in src/lib/aidm.ts) rather than shipping a raw array.

    "Manipulated" is dropped from the joined string when other values are present — it's
    a flag consumed by the manipulated_factors extraction below, not a level worth
    displaying alongside the real ones (e.g. AI accuracy = ["Manipulated", "95%-100%",
    "<60%"] should read "95%-100% · <60%", not repeat the flag). If "Manipulated" is the
    *only* value present, keep it — that still means something (varied, but not
    discretised into recorded levels) and dropping it would leave the field blank."""
    if isinstance(value, list):
        levels = [v for v in value if v != "Manipulated"]
        if levels:
            return " · ".join(levels)
        return "Manipulated" if value else None
    return value


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
        # write_bytes, not write_text: write_text does platform newline translation
        # (\n -> \r\n on Windows) with no way to opt out on Python 3.8. The rest of the
        # repo is LF-only, so encode by hand and write raw bytes instead.
        payload = json.dumps(self.map, indent=2, ensure_ascii=False) + "\n"
        self.path.write_bytes(payload.encode("utf-8"))


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
        # "Contradicting Studies" is not a property on the live Mechanisms database
        # (confirmed against the schema 2026-08-18) — it never was, or was removed
        # before this sync existed. row.get() returns None here, so this is always [].
        # Contradicting evidence for a mechanism is written into its Description/notes
        # prose instead (see AIAssistedDM/2026-08-11-mechanisms-proposal.md's
        # "Contradicting: ..." lines for the source of that convention). Left in the
        # output schema, not removed, so src/lib/aidm.ts's Mechanism.contradicting_studies
        # and the site's contradicting-evidence UI (FactorModal.astro) keep working —
        # they just never have anything to show until/unless Regina wants that relation
        # back in Notion.
        "contradicting_studies": row.get("Contradicting Studies") or [],
    }


def build_study(row: dict, slug: str) -> dict:
    coding = {key: _coding_display(row.get(prop)) for key, prop in CODING_FIELDS.items()}

    manipulated: list[str] = []
    for parent, paired, label in MANIPULATION_PAIRS:
        value = row.get(parent)
        is_manip = ("Manipulated" in value) if isinstance(value, list) else (value == "Manipulated")
        if not is_manip:
            continue
        # Filter "Manipulated" out of levels unconditionally: it's never a real option
        # on any of the dedicated "levels manipulated" fields, and it's exactly
        # the flag value that needs excluding for the AI accuracy self-paired case
        # (parent == paired there, so the raw list otherwise contains "Manipulated" too).
        levels = [lvl for lvl in (row.get(paired) or []) if lvl != "Manipulated"]
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


def apply_study_overlay_coding(study: dict, patch: dict) -> None:
    """need_for_cognition lives in the overlay at the top level of the study's patch
    (see data/overlay.json), but belongs inside study.coding — Notion has no property
    for it, so there is nothing to merge it against.

    ai_performance used to need the same treatment, back when Notion had no property for
    it either. It doesn't anymore (see "AI accuracy" in CODING_FIELDS) — deliberately NOT
    handled here now, even though some seeded overlay entries still carry a stale
    "ai_performance" key: applying it here would silently overwrite the live Notion value
    with 2026-08-05 data every run. If you're re-seeding overlay.json from an old export,
    strip "ai_performance" out of the studies patches first."""
    if "need_for_cognition" in patch:
        study["coding"]["need_for_cognition"] = patch["need_for_cognition"]


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
        print("Create a Notion internal integration, share all three databases "
              "(or the parent 'AI Assisted Decision-Making Framework' page) with it, "
              "then export NOTION_TOKEN=secret_xxx.", file=sys.stderr)
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
    by_study = {s["id"]: s for s in studies}
    for s in studies:
        for mid in s["supports_mechanisms"]:
            if mid in by_mech and s["id"] not in by_mech[mid]["supporting_studies"]:
                asymmetric.append(f"{s['id']} supports {mid}, not mirrored")
    for m in mechanisms:
        for sid in m["supporting_studies"]:
            study = by_study.get(sid)
            if study is not None and m["id"] not in study["supports_mechanisms"]:
                asymmetric.append(f"{m['id']} lists {sid}, not mirrored")

    # Editorial fields Notion does not hold
    overlay = json.loads(OVERLAY_PATH.read_text("utf-8")) if OVERLAY_PATH.exists() else {}
    for bucket, records in (("factors", factors), ("mechanisms", mechanisms), ("studies", studies)):
        patches = overlay.get(bucket, {})
        for rec in records:
            patch = patches.get(rec["id"], {})
            rec.update(patch)
            if bucket == "studies":
                apply_study_overlay_coding(rec, patch)

    factors.sort(key=lambda f: (f.get("component") or "", f.get("order") or 0))
    mechanisms.sort(key=lambda m: -m["n_support"])
    studies.sort(key=lambda s: (s.get("year") or 0, s.get("author") or ""))

    document = {
        "meta": {
            "title": "AI-Assisted Decision-Making — Framework Data",
            "exported": time.strftime("%Y-%m-%d", time.gmtime()),
            "source": "Notion project 'AI Assisted Decision-Making' (3 linked databases)",
            "source_url": FRAMEWORK_PAGE,
            "counts": {"factors": len(factors),
                       "mechanisms": len(mechanisms),
                       "studies": len(studies)},
            "structure": ("factors (framework nodes) <- mechanisms (directional claims) "
                          "<- studies (coded evidence). Mechanisms are the join: each names "
                          "one factor and lists supporting and contradicting studies."),
            "id_scheme": "Stable slugs held in data/slugs.json, assigned once per Notion page id.",
            "data_notes": overlay.get("meta", {}).get("data_notes", []),
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
        print(f"\n   {len(slugs.new)} new slug(s) (no seeded overlay data yet): {', '.join(slugs.new)}")

    orphans = [m["id"] for m in mechanisms if not m["n_support"] and not m["n_contradict"]]
    if orphans:
        print(f"\n   note: mechanism(s) with no linked studies: {', '.join(orphans)}")
    missing_factor = [m["id"] for m in mechanisms if not m["factor"]]
    if missing_factor:
        print(f"   note: mechanism(s) with no factor: {', '.join(missing_factor)}")

    # Missing-content report — nothing here blocks the run, but mechanism.description is
    # what the Level 1 mechanism cards actually render now (see MechanismCard.astro), so
    # an empty one ships as a blank "Details" disclosure. Surface that loudly rather than
    # letting it ship silently.
    no_description = [m["id"] for m in mechanisms if not m.get("description")]
    if no_description:
        print(f"\n   note: mechanism(s) with no Description text in Notion: {', '.join(no_description)}")

    if args.check:
        print("\n--check: nothing written.")
        return 1 if (dangling or asymmetric) else 0

    args.out.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(document, indent=2, ensure_ascii=False) + "\n"
    # read_text() applies universal-newline translation on read regardless of platform,
    # so this comparison is safe even though the write below is deliberately raw bytes.
    unchanged = args.out.exists() and _same_but_for_timestamp(args.out.read_text("utf-8"), payload)
    if unchanged:
        print(f"\nno content change; {args.out.relative_to(REPO_ROOT)} left alone")
    else:
        # write_bytes, not write_text: write_text does platform newline translation
        # (\n -> \r\n on Windows) with no way to opt out on Python 3.8. The rest of the
        # repo is LF-only, so encode by hand and write raw bytes instead.
        args.out.write_bytes(payload.encode("utf-8"))
        print(f"\nwrote {args.out.relative_to(REPO_ROOT)} "
              f"({len(payload) / 1024:.0f} KB, {len(studies)} studies, "
              f"{len(mechanisms)} mechanisms, {len(factors)} factors)")
    slugs.save()
    return 1 if dangling else 0


def _same_but_for_timestamp(old: str, new: str) -> bool:
    strip = lambda t: re.sub(r'"exported": "[^"]*"', "", t)
    return strip(old) == strip(new)


if __name__ == "__main__":
    sys.exit(main())
