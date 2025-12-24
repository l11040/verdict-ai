import { useEffect, useState, RefObject } from 'react';

export type DropdownPosition = 'top' | 'bottom';

export interface UseDropdownPositionOptions {
  /**
   * 트리거 요소의 ref (드롭다운을 여는 버튼 등)
   */
  triggerRef: RefObject<HTMLElement>;
  /**
   * 드롭다운 요소의 ref
   */
  dropdownRef: RefObject<HTMLElement>;
  /**
   * 드롭다운이 열려있는지 여부
   */
  isOpen: boolean;
  /**
   * 드롭다운과 트리거 사이의 간격 (px)
   * @default 4
   */
  gap?: number;
  /**
   * 뷰포트 가장자리로부터의 여백 (px)
   * @default 8
   */
  viewportPadding?: number;
  /**
   * 기본 위치 (공간이 충분하면 이 방향을 우선)
   * @default 'bottom'
   */
  preferredPosition?: DropdownPosition;
  /**
   * 드롭다운의 최소 높이 (px). 실제 높이를 측정하지 못할 경우 사용
   * @default 200
   */
  estimatedHeight?: number;
}

export interface DropdownPositionState {
  /**
   * 계산된 드롭다운 위치
   */
  position: DropdownPosition;
  /**
   * 드롭다운의 최종 위치 스타일 (top 또는 bottom 값)
   */
  top?: number;
  /**
   * 드롭다운의 최종 위치 스타일 (top 또는 bottom 값)
   */
  bottom?: number;
  /**
   * 드롭다운의 왼쪽 위치 (px) - absolute 기준
   */
  left?: number;
  /**
   * 드롭다운의 너비 (px)
   */
  width?: number;
  /**
   * fixed positioning 사용 여부
   */
  useFixed?: boolean;
  /**
   * fixed positioning일 때의 left 값 (viewport 기준)
   */
  fixedLeft?: number;
}

/**
 * 드롭다운의 위치를 자동으로 계산하는 훅
 * 
 * @example
 * ```tsx
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * const { position, top, left, width } = useDropdownPosition({
 *   triggerRef,
 *   dropdownRef,
 *   isOpen: true,
 * });
 * 
 * return (
 *   <div
 *     ref={dropdownRef}
 *     style={{
 *       position: 'absolute',
 *       [position]: top || bottom,
 *       left,
 *       width,
 *     }}
 *   >
 *     {children}
 *   </div>
 * );
 * ```
 */
export function useDropdownPosition({
  triggerRef,
  dropdownRef,
  isOpen,
  gap = 4,
  viewportPadding = 8,
  preferredPosition = 'bottom',
  estimatedHeight = 200,
}: UseDropdownPositionOptions): DropdownPositionState {
  const [positionState, setPositionState] = useState<DropdownPositionState>({
    position: preferredPosition,
  });

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) {
      return;
    }

    const trigger = triggerRef.current;
    const dropdown = dropdownRef.current;

    // 트리거 요소의 위치와 크기
    const triggerRect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 드롭다운의 실제 높이 (렌더링된 경우) 또는 예상 높이
    const dropdownHeight = dropdown.offsetHeight || estimatedHeight;

    // 아래쪽 공간
    const spaceBelow = viewportHeight - triggerRect.bottom - viewportPadding;
    // 위쪽 공간
    const spaceAbove = triggerRect.top - viewportPadding;

    // 선호하는 위치로 표시할 수 있는지 확인
    const canFitPreferred =
      preferredPosition === 'bottom'
        ? spaceBelow >= dropdownHeight + gap
        : spaceAbove >= dropdownHeight + gap;

    let finalPosition: DropdownPosition;
    let top: number | undefined;
    let bottom: number | undefined;

    if (canFitPreferred) {
      // 선호하는 위치에 표시 가능
      finalPosition = preferredPosition;
      if (preferredPosition === 'bottom') {
        top = triggerRect.bottom + gap;
      } else {
        bottom = viewportHeight - triggerRect.top + gap;
      }
    } else {
      // 선호하는 위치에 공간이 부족하면 반대편 확인
      if (preferredPosition === 'bottom') {
        // 아래쪽이 부족하면 위쪽 확인
        if (spaceAbove >= dropdownHeight + gap) {
          finalPosition = 'top';
          bottom = viewportHeight - triggerRect.top + gap;
        } else {
          // 둘 다 부족하면 더 많은 공간이 있는 쪽 선택
          finalPosition = spaceBelow >= spaceAbove ? 'bottom' : 'top';
          if (finalPosition === 'bottom') {
            top = triggerRect.bottom + gap;
          } else {
            bottom = viewportHeight - triggerRect.top + gap;
          }
        }
      } else {
        // 위쪽이 부족하면 아래쪽 확인
        if (spaceBelow >= dropdownHeight + gap) {
          finalPosition = 'bottom';
          top = triggerRect.bottom + gap;
        } else {
          // 둘 다 부족하면 더 많은 공간이 있는 쪽 선택
          finalPosition = spaceBelow >= spaceAbove ? 'bottom' : 'top';
          if (finalPosition === 'bottom') {
            top = triggerRect.bottom + gap;
          } else {
            bottom = viewportHeight - triggerRect.top + gap;
          }
        }
      }
    }

    let width = triggerRect.width;

    // fixed positioning을 위한 viewport 기준 위치
    let fixedLeft = triggerRect.left;

    // 오른쪽이 뷰포트를 벗어나면 조정 (fixed positioning용)
    if (fixedLeft + width > viewportWidth - viewportPadding) {
      fixedLeft = viewportWidth - width - viewportPadding;
      if (fixedLeft < viewportPadding) {
        fixedLeft = viewportPadding;
        width = viewportWidth - viewportPadding * 2;
      }
    }

    // absolute positioning에서는 너비만 조정 (left는 0으로 유지)
    // 컨테이너가 있고 오버플로우가 있을 수 있으므로 너비를 조정

    // 항상 fixed positioning 사용 (stacking context 문제 해결)
    setPositionState({
      position: finalPosition,
      top,
      bottom,
      left: 0,
      width,
      useFixed: true,
      fixedLeft,
    });
  }, [isOpen, triggerRef, dropdownRef, gap, viewportPadding, preferredPosition, estimatedHeight]);

  return positionState;
}

