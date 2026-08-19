import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Surface treatment. `accent`/`iris` = tinted; `soft`/`sunken` = flat fills. */
  variant?: 'default' | 'soft' | 'sunken' | 'outline' | 'accent' | 'iris' | 'float';
  /** Padding step: 0–3 (0, 16, 24, 32px). */
  padding?: 0 | 1 | 2 | 3;
  /** Lift on hover. */
  interactive?: boolean;
  as?: any;
  children?: React.ReactNode;
}

/**
 * Rounded surface container.
 * @startingPoint section="Core" subtitle="Tinted & flat card surfaces" viewport="700x150"
 */
export function Card(props: CardProps): JSX.Element;
