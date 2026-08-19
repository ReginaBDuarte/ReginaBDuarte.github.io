import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Coral = primary action; iris = secondary. */
  variant?: 'primary' | 'secondary' | 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Element/component to render as (e.g. 'a' for links). */
  as?: any;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Pill-shaped button in the brand voice.
 * @startingPoint section="Core" subtitle="Coral & iris pill buttons" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
