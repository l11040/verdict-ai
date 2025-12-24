import type { HTMLAttributes, ReactNode } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type DividerSize = 'xs' | 'sm' | 'md' | 'lg';

export interface DividerProps extends Omit<HTMLAttributes<HTMLHRElement>, 'style'> {
  /**
   * Divider 방향
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * Divider 스타일
   * @default 'solid'
   */
  variant?: DividerVariant;
  /**
   * Divider 색상
   * @default 'neutral'
   */
  color?: DividerColor;
  /**
   * Divider 두께
   * @default 'sm'
   */
  size?: DividerSize;
  /**
   * 텍스트 라벨 (수평 방향일 때만 사용 가능)
   */
  label?: ReactNode;
  /**
   * 라벨 위치
   * @default 'center'
   */
  labelPosition?: 'left' | 'center' | 'right';
  /**
   * 클래스명
   */
  className?: string;
  /**
   * 인라인 스타일
   */
  style?: React.CSSProperties;
}

