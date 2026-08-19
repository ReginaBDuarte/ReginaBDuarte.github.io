import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `highlight` = bright coral keyword pill (the deck's marker style). */
  variant?: 'coral' | 'iris' | 'rose' | 'steel' | 'neutral' | 'highlight' | 'iris-solid';
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}

/** Soft pill for keywords, topics, and categories. */
export function Tag(props: TagProps): JSX.Element;
