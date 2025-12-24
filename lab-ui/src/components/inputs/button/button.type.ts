import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'neutral';
export type ButtonStyle = 'solid' | 'outline' | 'ghost';
export type ButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  color?: ButtonColor;
  buttonStyle?: ButtonStyle;
  size?: ButtonSize;
  children: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  style?: React.CSSProperties;
}

