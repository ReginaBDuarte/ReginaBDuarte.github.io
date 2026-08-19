import React from 'react';

/**
 * The brand's human pictogram — a clean, recolorable rebuild of the deck's
 * coral figure. Used to mark the "human" in human-AI diagrams and as a motif.
 */
export function PersonMark({ size = 56, color = 'var(--coral-300)', title, className = '', ...rest }) {
  return (
    <svg
      width={size} height={size * (80 / 48)} viewBox="0 0 48 80"
      className={className} role={title ? 'img' : 'presentation'}
      aria-label={title} aria-hidden={title ? undefined : true} {...rest}
    >
      {title && <title>{title}</title>}
      <circle cx="24" cy="14" r="12.5" fill={color} />
      <path
        d="M11,53 C11,40.5 16.6,33 24,33 C31.4,33 37,40.5 37,53 L37,70 C37,73 35,75 32,75 L16,75 C13,75 11,73 11,70 Z"
        fill={color}
      />
    </svg>
  );
}
