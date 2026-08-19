import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-badge-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Badge({ children, variant = 'ink', className = '', ...rest }) {
  return (
    <span className={`rbd-badge rbd-badge--${variant} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
