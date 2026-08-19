import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-stat-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Stat({ value, label, sub, variant = 'default', size = 'md', className = '', ...rest }) {
  const v = variant === 'default' ? '' : `rbd-stat--${variant}`;
  return (
    <div className={`rbd-stat ${v} rbd-stat--${size} ${className}`.replace(/\s+/g, ' ').trim()} {...rest}>
      {sub && <div className="rbd-stat__sub">{sub}</div>}
      <div className="rbd-stat__value">{value}</div>
      {label && <div className="rbd-stat__label">{label}</div>}
    </div>
  );
}
