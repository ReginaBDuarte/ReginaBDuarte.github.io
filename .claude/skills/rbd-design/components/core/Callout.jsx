import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-callout-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Callout({ children, variant = 'iris', label, className = '', ...rest }) {
  return (
    <div className={`rbd-callout rbd-callout--${variant} ${className}`.trim()} {...rest}>
      {label && <div className="rbd-callout__label">{label}</div>}
      <div className="rbd-callout__body">{children}</div>
    </div>
  );
}
