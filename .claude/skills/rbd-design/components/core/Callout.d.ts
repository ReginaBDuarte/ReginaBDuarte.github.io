import React from 'react';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tint. Coral & iris mirror the deck's research-question boxes. */
  variant?: 'coral' | 'iris' | 'rose' | 'neutral';
  /** Optional header chip, e.g. "RQ1", "Finding". */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Colored callout box with an optional label chip — the deck's RQ block.
 * @startingPoint section="Core" subtitle="Labelled research-question boxes" viewport="700x150"
 */
export function Callout(props: CalloutProps): JSX.Element;
