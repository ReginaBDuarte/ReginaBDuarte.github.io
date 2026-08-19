import React from 'react';

/**
 * Hand-drawn underline / divider — the deck's purple squiggle.
 * Place under a heading or use as a soft section divider.
 */
export function Squiggle({ width = 200, color = 'var(--iris-300)', strokeWidth = 3, className = '', ...rest }) {
  return (
    <svg
      width={width} height={width * (16 / 200)} viewBox="0 0 200 16"
      className={className} fill="none" preserveAspectRatio="none"
      role="presentation" aria-hidden="true" {...rest}
    >
      <path
        d="M2,9 C26,2.5 46,13.5 70,8.5 C94,3.5 116,13 140,8 C160,4 182,10.5 198,6.5"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </svg>
  );
}
