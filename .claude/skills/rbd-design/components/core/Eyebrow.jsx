import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-eyebrow-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Eyebrow({ children, variant = 'coral', mark = true, className = '', ...rest }) {
  return (
    <span className={`rbd-eyebrow rbd-eyebrow--${variant} ${className}`.trim()} {...rest}>
      {mark && <span className="rbd-eyebrow__mark" />}
      {children}
    </span>
  );
}
