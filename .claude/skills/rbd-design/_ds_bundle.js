/* @ds-bundle: {"format":3,"namespace":"ReginaDeBritoDuarteDesignSystem_6df855","components":[{"name":"Avatar","sourcePath":"components/brand/Avatar.jsx"},{"name":"PersonMark","sourcePath":"components/brand/PersonMark.jsx"},{"name":"Squiggle","sourcePath":"components/brand/Squiggle.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Callout","sourcePath":"components/core/Callout.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/brand/Avatar.jsx":"f227f8b7f769","components/brand/PersonMark.jsx":"7585a4fa328b","components/brand/Squiggle.jsx":"927f78c4cb8f","components/core/Badge.jsx":"4b4a68e5d8a3","components/core/Button.jsx":"f0383ba10eba","components/core/Callout.jsx":"3d08ec002645","components/core/Card.jsx":"dd2b7da90911","components/core/Eyebrow.jsx":"da20e0c1c27b","components/core/Stat.jsx":"e0fad22de6f5","components/core/Tag.jsx":"1de35f820140"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ReginaDeBritoDuarteDesignSystem_6df855 = window.ReginaDeBritoDuarteDesignSystem_6df855 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-avatar{
  display:inline-flex; align-items:center; justify-content:center;
  border-radius: 50%; overflow: hidden; flex: none;
  font-family: var(--font-display); font-weight: var(--weight-bold);
  background: var(--iris-200); color: var(--iris-700);
  border: 2px solid var(--paper); box-shadow: var(--shadow-sm);
}
.rbd-avatar img{ width:100%; height:100%; object-fit: cover; display:block; }
.rbd-avatar--coral{ background: var(--coral-200); color: var(--coral-700); }
.rbd-avatar--ink{ background: var(--ink-900); color: var(--ivory); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-avatar-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-avatar-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Avatar({
  src,
  alt = '',
  initials,
  size = 44,
  variant = 'iris',
  className = '',
  ...rest
}) {
  const v = variant === 'iris' ? '' : `rbd-avatar--${variant}`;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `rbd-avatar ${v} ${className}`.trim(),
    style: {
      width: size,
      height: size,
      fontSize: Math.round(size * 0.4)
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/brand/PersonMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The brand's human pictogram — a clean, recolorable rebuild of the deck's
 * coral figure. Used to mark the "human" in human-AI diagrams and as a motif.
 */
function PersonMark({
  size = 56,
  color = 'var(--coral-300)',
  title,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size * (80 / 48),
    viewBox: "0 0 48 80",
    className: className,
    role: title ? 'img' : 'presentation',
    "aria-label": title,
    "aria-hidden": title ? undefined : true
  }, rest), title && /*#__PURE__*/React.createElement("title", null, title), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "14",
    r: "12.5",
    fill: color
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11,53 C11,40.5 16.6,33 24,33 C31.4,33 37,40.5 37,53 L37,70 C37,73 35,75 32,75 L16,75 C13,75 11,73 11,70 Z",
    fill: color
  }));
}
Object.assign(__ds_scope, { PersonMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PersonMark.jsx", error: String((e && e.message) || e) }); }

// components/brand/Squiggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Hand-drawn underline / divider — the deck's purple squiggle.
 * Place under a heading or use as a soft section divider.
 */
function Squiggle({
  width = 200,
  color = 'var(--iris-300)',
  strokeWidth = 3,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: width,
    height: width * (16 / 200),
    viewBox: "0 0 200 16",
    className: className,
    fill: "none",
    preserveAspectRatio: "none",
    role: "presentation",
    "aria-hidden": "true"
  }, rest), /*#__PURE__*/React.createElement("path", {
    d: "M2,9 C26,2.5 46,13.5 70,8.5 C94,3.5 116,13 140,8 C160,4 182,10.5 198,6.5",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round"
  }));
}
Object.assign(__ds_scope, { Squiggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Squiggle.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-badge{
  display:inline-flex; align-items:center;
  font-family: var(--font-mono); font-weight: var(--weight-semibold);
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 4px 8px; border-radius: var(--radius-xs); line-height: 1;
}
.rbd-badge--coral{   background: var(--coral-500); color:#fff; }
.rbd-badge--iris{    background: var(--iris-500);  color:#fff; }
.rbd-badge--ink{     background: var(--ink-900);   color: var(--ivory); }
.rbd-badge--soft{    background: var(--iris-100);  color: var(--iris-700); }
.rbd-badge--outline{ background: transparent; color: var(--ink-700); box-shadow: inset 0 0 0 1.5px var(--border-strong); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-badge-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-badge-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Badge({
  children,
  variant = 'ink',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `rbd-badge rbd-badge--${variant} ${className}`.trim()
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-btn{
  font-family: var(--font-text);
  font-weight: var(--weight-semibold);
  border: var(--border-bold) solid transparent;
  border-radius: var(--radius-pill);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: var(--space-2);
  line-height: 1; white-space: nowrap;
  transition: transform var(--dur-fast) var(--ease-out),
              background var(--dur) var(--ease-out),
              box-shadow var(--dur) var(--ease-out),
              border-color var(--dur) var(--ease-out);
}
.rbd-btn:active{ transform: translateY(1px) scale(0.985); }
.rbd-btn:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--bg-canvas), 0 0 0 5px var(--focus-ring); }
.rbd-btn[disabled]{ opacity: .45; cursor: not-allowed; transform: none; }

.rbd-btn--sm{ font-size: var(--text-body-s); padding: 8px 16px; }
.rbd-btn--md{ font-size: var(--text-body); padding: 11px 22px; }
.rbd-btn--lg{ font-size: var(--text-body-l); padding: 15px 30px; }

.rbd-btn--primary{ background: var(--coral-500); color: #fff; box-shadow: var(--shadow-accent); }
.rbd-btn--primary:hover{ background: var(--coral-600); }
.rbd-btn--secondary{ background: var(--iris-500); color: #fff; box-shadow: var(--shadow-iris); }
.rbd-btn--secondary:hover{ background: var(--iris-600); }
.rbd-btn--soft{ background: var(--iris-100); color: var(--iris-700); }
.rbd-btn--soft:hover{ background: var(--iris-200); }
.rbd-btn--outline{ background: transparent; color: var(--ink-900); border-color: var(--ink-300); }
.rbd-btn--outline:hover{ border-color: var(--ink-900); background: var(--cream); }
.rbd-btn--ghost{ background: transparent; color: var(--ink-700); }
.rbd-btn--ghost:hover{ background: var(--surface-soft); color: var(--ink-900); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-btn-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-btn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  as = 'button',
  className = '',
  ...rest
}) {
  const Tag = as;
  const cls = `rbd-btn rbd-btn--${size} rbd-btn--${variant} ${className}`.trim();
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-callout{
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: var(--border-hair) solid transparent;
}
.rbd-callout__label{
  display:inline-flex; align-items:center;
  font-family: var(--font-mono); font-size: var(--text-eyebrow);
  font-weight: var(--weight-semibold); letter-spacing: 0.08em; text-transform: uppercase;
  padding: 5px 11px; border-radius: var(--radius-pill); margin-bottom: var(--space-3); line-height:1;
}
.rbd-callout__body{ font-family: var(--font-text); font-size: var(--text-body); color: var(--ink-800); line-height: var(--leading-normal); }
.rbd-callout__body > :first-child{ margin-top: 0; }
.rbd-callout__body > :last-child{ margin-bottom: 0; }

.rbd-callout--coral{ background: var(--coral-100); }
.rbd-callout--coral .rbd-callout__label{ background: var(--coral-300); color: var(--ink-900); }
.rbd-callout--iris{ background: var(--iris-100); }
.rbd-callout--iris .rbd-callout__label{ background: var(--iris-200); color: var(--iris-700); }
.rbd-callout--rose{ background: var(--rose-200); }
.rbd-callout--rose .rbd-callout__label{ background: var(--rose-300); color: #7E3F41; }
.rbd-callout--neutral{ background: var(--cream); border-color: var(--border); }
.rbd-callout--neutral .rbd-callout__label{ background: var(--ink-900); color: var(--ivory); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-callout-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-callout-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Callout({
  children,
  variant = 'iris',
  label,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `rbd-callout rbd-callout--${variant} ${className}`.trim()
  }, rest), label && /*#__PURE__*/React.createElement("div", {
    className: "rbd-callout__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "rbd-callout__body"
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Callout.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-card{
  background: var(--surface-card);
  border: var(--border-hair) solid var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
}
.rbd-card--p0{ padding: 0; }
.rbd-card--p1{ padding: var(--space-4); }
.rbd-card--p2{ padding: var(--space-6); }
.rbd-card--p3{ padding: var(--space-8); }
.rbd-card--soft{ background: var(--surface-soft); border-color: transparent; box-shadow: none; }
.rbd-card--sunken{ background: var(--surface-sunken); border-color: transparent; box-shadow: none; }
.rbd-card--outline{ background: transparent; border-color: var(--border); box-shadow: none; }
.rbd-card--accent{ background: var(--coral-50); border-color: var(--coral-200); box-shadow: none; }
.rbd-card--iris{ background: var(--iris-50); border-color: var(--iris-200); box-shadow: none; }
.rbd-card--float{ box-shadow: var(--shadow-lg); border-color: transparent; }
.rbd-card--interactive{ transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out); cursor: pointer; }
.rbd-card--interactive:hover{ transform: translateY(-3px); box-shadow: var(--shadow-lg); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-card-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-card-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Card({
  children,
  variant = 'default',
  padding = 2,
  interactive = false,
  as = 'div',
  className = '',
  ...rest
}) {
  const Tag = as;
  const v = variant === 'default' ? '' : `rbd-card--${variant}`;
  const cls = `rbd-card rbd-card--p${padding} ${v} ${interactive ? 'rbd-card--interactive' : ''} ${className}`.replace(/\s+/g, ' ').trim();
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-eyebrow{
  display:inline-flex; align-items:center; gap: var(--space-2);
  font-family: var(--font-mono); font-size: var(--text-eyebrow);
  font-weight: var(--weight-medium); letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase; color: var(--accent-text); line-height: 1;
}
.rbd-eyebrow__mark{ width: 18px; height: 2px; background: var(--coral-400); border-radius: 2px; }
.rbd-eyebrow--iris{ color: var(--iris-700); }
.rbd-eyebrow--iris .rbd-eyebrow__mark{ background: var(--iris-400); }
.rbd-eyebrow--muted{ color: var(--text-muted); }
.rbd-eyebrow--muted .rbd-eyebrow__mark{ background: var(--ink-300); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-eyebrow-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-eyebrow-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Eyebrow({
  children,
  variant = 'coral',
  mark = true,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `rbd-eyebrow rbd-eyebrow--${variant} ${className}`.trim()
  }, rest), mark && /*#__PURE__*/React.createElement("span", {
    className: "rbd-eyebrow__mark"
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-stat{ display:flex; flex-direction:column; gap: 6px; }
.rbd-stat__value{
  font-family: var(--font-display); font-weight: var(--weight-extra);
  font-size: var(--text-display-m); line-height: 0.95;
  letter-spacing: var(--tracking-tight); color: var(--ink-900);
}
.rbd-stat__value em{ font-style: normal; color: var(--coral-500); }
.rbd-stat__label{ font-family: var(--font-text); font-size: var(--text-body-s); color: var(--text-muted); line-height: var(--leading-snug); }
.rbd-stat__sub{ font-family: var(--font-mono); font-size: var(--text-eyebrow); letter-spacing: 0.04em; color: var(--text-faint); text-transform: uppercase; }
.rbd-stat--coral .rbd-stat__value{ color: var(--coral-500); }
.rbd-stat--iris .rbd-stat__value{ color: var(--iris-600); }
.rbd-stat--lg .rbd-stat__value{ font-size: var(--text-display-l); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-stat-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-stat-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Stat({
  value,
  label,
  sub,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}) {
  const v = variant === 'default' ? '' : `rbd-stat--${variant}`;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `rbd-stat ${v} rbd-stat--${size} ${className}`.replace(/\s+/g, ' ').trim()
  }, rest), sub && /*#__PURE__*/React.createElement("div", {
    className: "rbd-stat__sub"
  }, sub), /*#__PURE__*/React.createElement("div", {
    className: "rbd-stat__value"
  }, value), label && /*#__PURE__*/React.createElement("div", {
    className: "rbd-stat__label"
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rbd-tag{
  display:inline-flex; align-items:center; gap:6px;
  font-family: var(--font-text); font-weight: var(--weight-semibold);
  font-size: var(--text-caption); line-height: 1;
  padding: 6px 12px; border-radius: var(--radius-pill);
  border: var(--border-hair) solid transparent;
}
.rbd-tag__dot{ width:7px; height:7px; border-radius:50%; background: currentColor; opacity:.85; }
.rbd-tag--coral{   background: var(--coral-100); color: var(--coral-700); }
.rbd-tag--iris{    background: var(--iris-100);  color: var(--iris-700); }
.rbd-tag--rose{    background: var(--rose-200);  color: #8E4A4C; }
.rbd-tag--steel{   background: var(--steel-100); color: var(--steel-700); }
.rbd-tag--neutral{ background: var(--cream); color: var(--ink-700); border-color: var(--border); }
.rbd-tag--highlight{ background: var(--coral-300); color: var(--ink-900); }
.rbd-tag--iris-solid{ background: var(--iris-200); color: var(--iris-700); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rbd-tag-css')) {
  const s = document.createElement('style');
  s.id = 'rbd-tag-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tag({
  children,
  variant = 'iris',
  dot = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `rbd-tag rbd-tag--${variant} ${className}`.trim()
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "rbd-tag__dot"
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.PersonMark = __ds_scope.PersonMark;

__ds_ns.Squiggle = __ds_scope.Squiggle;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

})();
