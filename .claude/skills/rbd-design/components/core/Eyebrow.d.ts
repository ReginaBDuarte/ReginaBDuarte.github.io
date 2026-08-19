import React from 'react';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'coral' | 'iris' | 'muted';
  /** Leading dash mark. */
  mark?: boolean;
  children?: React.ReactNode;
}

/** Mono kicker/eyebrow — the brand's signature section label. */
export function Eyebrow(props: EyebrowProps): JSX.Element;
