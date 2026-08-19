import React from 'react';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Big number/figure. Wrap part in <em> to coral-highlight it. */
  value: React.ReactNode;
  label?: React.ReactNode;
  /** Small mono label above the figure. */
  sub?: React.ReactNode;
  variant?: 'default' | 'coral' | 'iris';
  size?: 'md' | 'lg';
}

/** Display-figure stat block for headline numbers. */
export function Stat(props: StatProps): JSX.Element;
