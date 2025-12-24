import type { ReactNode } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type TooltipSize = 'sm' | 'md' | 'lg';

export interface TooltipProps {
  /**
   * Tooltip 내용
   */
  content: ReactNode;
  /**
   * Tooltip을 표시할 트리거 요소
   */
  children: ReactNode;
  /**
   * Tooltip 위치
   * @default 'top'
   */
  position?: TooltipPosition;
  /**
   * Tooltip 색상
   * @default 'neutral'
   */
  color?: TooltipColor;
  /**
   * Tooltip 크기
   * @default 'sm'
   */
  size?: TooltipSize;
  /**
   * Tooltip 표시 지연 시간 (ms)
   * @default 0
   */
  delay?: number;
  /**
   * Tooltip 숨김 지연 시간 (ms)
   * @default 0
   */
  hideDelay?: number;
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 클래스명
   */
  className?: string;
  /**
   * 트리거 요소의 클래스명
   */
  triggerClassName?: string;
}

