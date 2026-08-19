import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-tag-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Tag({ children, variant = 'iris', dot = false, className = '', ...rest }) {
  return (
    <span className={`rbd-tag rbd-tag--${variant} ${className}`.trim()} {...rest}>
      {dot && <span className="rbd-tag__dot" />}
      {children}
    </span>
  );
}
