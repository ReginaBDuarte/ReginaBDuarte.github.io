import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-card-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Card({
  children, variant = 'default', padding = 2, interactive = false,
  as = 'div', className = '', ...rest
}) {
  const Tag = as;
  const v = variant === 'default' ? '' : `rbd-card--${variant}`;
  const cls = `rbd-card rbd-card--p${padding} ${v} ${interactive ? 'rbd-card--interactive' : ''} ${className}`.replace(/\s+/g, ' ').trim();
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
