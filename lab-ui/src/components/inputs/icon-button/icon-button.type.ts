import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonColor = 'primary' | 'secondary' | 'danger' | 'neutral';
export type IconButtonStyle = 'solid' | 'outline' | 'ghost';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  color?: IconButtonColor;
  buttonStyle?: IconButtonStyle;
  size?: IconButtonSize;
  /**
   * 아이콘 요소. ReactNode 타입으로 아이콘 컴포넌트나 SVG를 전달할 수 있습니다.
   */
  children?: ReactNode;
  /**
   * 아이콘 요소 (children 대신 사용 가능)
   */
  icon?: ReactNode;
  /**
   * 접근성을 위한 aria-label (필수)
   */
  'aria-label': string;
  style?: React.CSSProperties;
}

