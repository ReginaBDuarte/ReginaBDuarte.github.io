import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** Fallback initials when no image. */
  initials?: string;
  size?: number;
  variant?: 'iris' | 'coral' | 'ink';
}

/** Circular avatar with image or initials fallback. */
export function Avatar(props: AvatarProps): JSX.Element;
