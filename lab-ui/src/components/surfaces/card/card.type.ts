import type { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'outlined' | 'filled' | 'elevated';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CardColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'default';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /**
   * Card 스타일 변형
   * @default 'outlined'
   */
  variant?: CardVariant;
  /**
   * Card 크기
   * @default 'md'
   */
  size?: CardSize;
  /**
   * Card 패딩
   * @default 'md'
   */
  padding?: CardPadding;
  /**
   * Card 색상 (테두리, 그림자 등에 적용)
   * @default 'default'
   */
  color?: CardColor;
  /**
   * Card 내용
   */
  children?: ReactNode;
  /**
   * 클래스명
   */
  className?: string;
  /**
   * 인라인 스타일
   */
  style?: React.CSSProperties;
}

