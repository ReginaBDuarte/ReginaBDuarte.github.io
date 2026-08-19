import React from 'react';

export interface PersonMarkProps extends React.SVGProps<SVGSVGElement> {
  /** Width in px (height scales 80:48). */
  size?: number;
  /** Any CSS color or token, e.g. 'var(--iris-300)'. */
  color?: string;
  title?: string;
}

/** Brand human pictogram for human-AI diagrams. */
export function PersonMark(props: PersonMarkProps): JSX.Element;
