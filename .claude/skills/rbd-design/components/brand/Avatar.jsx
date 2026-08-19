import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rbd-avatar-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Avatar({ src, alt = '', initials, size = 44, variant = 'iris', className = '', ...rest }) {
  const v = variant === 'iris' ? '' : `rbd-avatar--${variant}`;
  return (
    <span
      className={`rbd-avatar ${v} ${className}`.trim()}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      {...rest}
    >
      {src ? <img src={src} alt={alt} /> : initials}
    </span>
  );
}
