import type { InputHTMLAttributes, ReactNode } from 'react';

export type TextFieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextFieldColor = 'primary' | 'secondary' | 'neutral';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 라벨 텍스트
   */
  label?: string;
  /**
   * 도움말 텍스트
   */
  helperText?: string;
  /**
   * 에러 상태
   */
  error?: boolean;
  /**
   * 에러 메시지
   */
  errorMessage?: string;
  /**
   * TextField 크기
   * @default 'md'
   */
  size?: TextFieldSize;
  /**
   * TextField 색상
   * @default 'neutral'
   */
  color?: TextFieldColor;
  /**
   * 시작 아이콘
   */
  startIcon?: ReactNode;
  /**
   * 끝 아이콘
   */
  endIcon?: ReactNode;
  /**
   * 클래스명
   */
  className?: string;
  /**
   * 입력 필드 클래스명
   */
  inputClassName?: string;
}

