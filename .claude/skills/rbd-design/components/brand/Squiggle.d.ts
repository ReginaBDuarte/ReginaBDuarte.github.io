import React from 'react';

export interface SquiggleProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  color?: string;
  strokeWidth?: number;
}

/** Hand-drawn underline / divider accent. */
export function Squiggle(props: SquiggleProps): JSX.Element;
