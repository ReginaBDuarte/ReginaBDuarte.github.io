import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'coral' | 'iris' | 'ink' | 'soft' | 'outline';
  children?: React.ReactNode;
}

/** Small uppercase mono label for status / section markers. */
export function Badge(props: BadgeProps): JSX.Element;
