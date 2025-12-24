import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type BadgeVariant = 'solid' | 'outline' | 'soft';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /**
   * Badge 색상
   * @default 'neutral'
   */
  color?: BadgeColor;
  /**
   * Badge 스타일
   * @default 'solid'
   */
  variant?: BadgeVariant;
  /**
   * Badge 크기
   * @default 'sm'
   */
  size?: BadgeSize;
  /**
   * Badge 내용
   */
  children?: ReactNode;
  /**
   * 시작 아이콘
   */
  startIcon?: ReactNode;
  /**
   * 끝 아이콘
   */
  endIcon?: ReactNode;
  /**
   * Dot만 표시 (텍스트 없이)
   */
  dot?: boolean;
  /**
   * 숫자 표시 (오버레이 모드에서 사용)
   */
  count?: number;
  /**
   * 최대 숫자 제한 (이 값을 초과하면 maxCount+ 형식으로 표시)
   * @default 99
   */
  maxCount?: number;
  /**
   * 오버레이 모드 (절대 위치로 배치)
   */
  overlay?: boolean;
  /**
   * 클래스명
   */
  className?: string;
  /**
   * 인라인 스타일
   */
  style?: React.CSSProperties;
}

export interface BadgeOverlayProps {
  /**
   * 래핑할 자식 요소
   */
  children: ReactNode;
  /**
   * Badge props
   */
  badge: Omit<BadgeProps, 'overlay'>;
  /**
   * Badge 위치 설정
   * @default { vertical: 'top', horizontal: 'right' }
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  /**
   * Badge 위치 조정 (anchorOrigin 기준으로 추가 오프셋)
   */
  offset?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /**
   * 클래스명
   */
  className?: string;
}

