import type { HTMLAttributes, ReactNode } from 'react';

export type TabsVariant = 'pills' | 'underline' | 'enclosed' | 'chip';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

export interface TabItem {
  /**
   * 탭의 고유 ID
   */
  id: string;
  /**
   * 탭 라벨
   */
  label: ReactNode;
  /**
   * 탭 아이콘 (시작 부분)
   */
  startIcon?: ReactNode;
  /**
   * 탭 아이콘 (끝 부분)
   */
  endIcon?: ReactNode;
  /**
   * 탭 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 탭에 표시할 Badge
   */
  badge?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * 탭 아이템 목록
   */
  items: TabItem[];
  /**
   * 현재 활성화된 탭 ID
   */
  value?: string;
  /**
   * 탭 변경 핸들러
   */
  onChange?: (value: string) => void;
  /**
   * 기본 활성화된 탭 ID (비제어 모드)
   */
  defaultValue?: string;
  /**
   * 탭 스타일
   * @default 'pills'
   */
  variant?: TabsVariant;
  /**
   * 탭 크기
   * @default 'md'
   */
  size?: TabsSize;
  /**
   * 탭 색상
   * @default 'primary'
   */
  color?: TabsColor;
  /**
   * 전체 탭 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 탭 방향
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 클래스명
   */
  className?: string;
  /**
   * 탭 리스트 클래스명
   */
  tabsListClassName?: string;
  /**
   * 탭 패널 클래스명
   */
  tabPanelClassName?: string;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 탭 패널 내용
   */
  children: ReactNode;
  /**
   * 클래스명
   */
  className?: string;
}

