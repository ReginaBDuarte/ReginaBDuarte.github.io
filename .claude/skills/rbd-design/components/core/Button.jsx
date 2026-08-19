import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-btn-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Button({
  children, variant = 'primary', size = 'md',
  iconLeft, iconRight, as = 'button', className = '', ...rest
}) {
  const Tag = as;
  const cls = `rbd-btn rbd-btn--${size} rbd-btn--${variant} ${className}`.trim();
  return (
    <Tag className={cls} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
