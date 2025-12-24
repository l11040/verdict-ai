import type { HTMLAttributes } from 'react';

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SelectColor = 'primary' | 'secondary' | 'neutral';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * 선택 옵션들
   */
  options: SelectOption[];
  /**
   * 현재 선택된 값
   */
  value?: string;
  /**
   * 값이 변경될 때 호출되는 콜백
   */
  onChange?: (value: string) => void;
  /**
   * 플레이스홀더 텍스트
   */
  placeholder?: string;
  /**
   * 비활성화 여부
   */
  disabled?: boolean;
  /**
   * 에러 상태
   */
  error?: boolean;
  /**
   * 에러 메시지
   */
  errorMessage?: string;
  /**
   * Select 크기
   * @default 'md'
   */
  size?: SelectSize;
  /**
   * Select 색상
   * @default 'neutral'
   */
  color?: SelectColor;
  /**
   * 드롭다운의 기본 위치
   * @default 'bottom'
   */
  preferredPosition?: 'top' | 'bottom';
  /**
   * 클래스명
   */
  className?: string;
}

