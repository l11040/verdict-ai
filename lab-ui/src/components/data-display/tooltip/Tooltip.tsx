import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import { tooltipVariants } from './tooltip.variant';
import type { TooltipProps } from './tooltip.type';

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      position = 'top',
      color = 'neutral',
      size = 'sm',
      delay = 0,
      hideDelay = 0,
      disabled = false,
      className,
      triggerClassName,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const [showArrow, setShowArrow] = useState(true);
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const calculatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportPadding = 8;

      let originalTop = 0;
      let originalLeft = 0;

      switch (position) {
        case 'top':
          originalTop = triggerRect.top - tooltipRect.height - 8;
          originalLeft = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          originalTop = triggerRect.bottom + 8;
          originalLeft = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          originalTop = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          originalLeft = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          originalTop = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          originalLeft = triggerRect.right + 8;
          break;
      }

      // 뷰포트 경계 체크 및 조정
      let adjustedTop = originalTop;
      let adjustedLeft = originalLeft;

      if (adjustedLeft < viewportPadding) {
        adjustedLeft = viewportPadding;
      } else if (adjustedLeft + tooltipRect.width > window.innerWidth - viewportPadding) {
        adjustedLeft = window.innerWidth - tooltipRect.width - viewportPadding;
      }

      if (adjustedTop < viewportPadding) {
        adjustedTop = viewportPadding;
      } else if (adjustedTop + tooltipRect.height > window.innerHeight - viewportPadding) {
        adjustedTop = window.innerHeight - tooltipRect.height - viewportPadding;
      }

      // 위치가 조정되었는지 확인 (1px 이상 차이)
      const isPositionAdjusted = 
        Math.abs(adjustedTop - originalTop) > 1 || 
        Math.abs(adjustedLeft - originalLeft) > 1;

      setShowArrow(!isPositionAdjusted);

      setTooltipStyle({
        position: 'fixed',
        top: `${adjustedTop}px`,
        left: `${adjustedLeft}px`,
        opacity: isOpen ? 1 : 0,
        pointerEvents: 'none',
      });

      // 화살표 스타일 설정 (위치가 조정되지 않았을 때만)
      if (!isPositionAdjusted) {
        if (position === 'top' || position === 'bottom') {
          setArrowStyle({
            left: '50%',
            transform: 'translateX(-50%)',
          });
        } else {
          setArrowStyle({
            top: '50%',
            transform: 'translateY(-50%)',
          });
        }
      } else {
        setArrowStyle({});
      }
    }, [position, isOpen]);

    useEffect(() => {
      if (isOpen) {
        // 위치 계산을 위해 약간의 지연
        requestAnimationFrame(() => {
          calculatePosition();
        });
      }
    }, [isOpen, calculatePosition]);

    const handleShow = useCallback(() => {
      if (disabled) return;

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (delay > 0) {
        showTimeoutRef.current = setTimeout(() => {
          setIsOpen(true);
        }, delay);
      } else {
        setIsOpen(true);
      }
    }, [disabled, delay]);

    const handleHide = useCallback(() => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }

      if (hideDelay > 0) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, hideDelay);
      } else {
        setIsOpen(false);
      }
    }, [hideDelay]);

    // 스크롤 및 리사이즈 이벤트 처리
    useEffect(() => {
      if (!isOpen) return;

      const handleScroll = () => {
        handleHide();
      };

      const handleResize = () => {
        handleHide();
      };

      // 스크롤 가능한 부모 요소들 감지
      const scrollableParents: (HTMLElement | Window)[] = [window];
      let parent = triggerRef.current?.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflow === 'auto' || style.overflow === 'scroll' || 
            style.overflowY === 'auto' || style.overflowY === 'scroll' ||
            style.overflowX === 'auto' || style.overflowX === 'scroll') {
          scrollableParents.push(parent);
        }
        parent = parent.parentElement;
      }

      // 모든 스크롤 가능한 부모에 이벤트 리스너 추가
      scrollableParents.forEach((element) => {
        if (element === window) {
          window.addEventListener('scroll', handleScroll, true);
          window.addEventListener('resize', handleResize);
        } else {
          (element as HTMLElement).addEventListener('scroll', handleScroll, true);
        }
      });

      return () => {
        scrollableParents.forEach((element) => {
          if (element === window) {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
          } else {
            (element as HTMLElement).removeEventListener('scroll', handleScroll, true);
          }
        });
      };
    }, [isOpen, handleHide]);

    useEffect(() => {
      return () => {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, []);

    // 트리거 요소에 이벤트 핸들러 추가
    const triggerElement = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement, {
          ref: (node: HTMLElement | null) => {
            triggerRef.current = node;
            if (typeof (children as any).ref === 'function') {
              (children as any).ref(node);
            } else if ((children as any).ref) {
              (children as any).ref.current = node;
            }
          },
          onMouseEnter: handleShow,
          onMouseLeave: handleHide,
          onFocus: handleShow,
          onBlur: handleHide,
          className: cn('inline-block', triggerClassName, (children as any).props?.className),
        })
      : (
          <span
            ref={triggerRef as React.RefObject<HTMLSpanElement>}
            onMouseEnter={handleShow}
            onMouseLeave={handleHide}
            onFocus={handleShow}
            onBlur={handleHide}
            className={cn('inline-block', triggerClassName)}
          >
            {children}
          </span>
        );

    // 화살표 색상 클래스 매핑
    const arrowColorClasses = {
      primary: {
        top: 'border-t-primary-600 dark:border-t-primary-500',
        bottom: 'border-b-primary-600 dark:border-b-primary-500',
        left: 'border-l-primary-600 dark:border-l-primary-500',
        right: 'border-r-primary-600 dark:border-r-primary-500',
      },
      secondary: {
        top: 'border-t-secondary-600 dark:border-t-secondary-500',
        bottom: 'border-b-secondary-600 dark:border-b-secondary-500',
        left: 'border-l-secondary-600 dark:border-l-secondary-500',
        right: 'border-r-secondary-600 dark:border-r-secondary-500',
      },
      success: {
        top: 'border-t-success-600 dark:border-t-success-500',
        bottom: 'border-b-success-600 dark:border-b-success-500',
        left: 'border-l-success-600 dark:border-l-success-500',
        right: 'border-r-success-600 dark:border-r-success-500',
      },
      warning: {
        top: 'border-t-warning-600 dark:border-t-warning-500',
        bottom: 'border-b-warning-600 dark:border-b-warning-500',
        left: 'border-l-warning-600 dark:border-l-warning-500',
        right: 'border-r-warning-600 dark:border-r-warning-500',
      },
      danger: {
        top: 'border-t-error-600 dark:border-t-error-500',
        bottom: 'border-b-error-600 dark:border-b-error-500',
        left: 'border-l-error-600 dark:border-l-error-500',
        right: 'border-r-error-600 dark:border-r-error-500',
      },
      neutral: {
        top: 'border-t-neutral-900 dark:border-t-neutral-800',
        bottom: 'border-b-neutral-900 dark:border-b-neutral-800',
        left: 'border-l-neutral-900 dark:border-l-neutral-800',
        right: 'border-r-neutral-900 dark:border-r-neutral-800',
      },
    };

    const tooltipContent = (
      <div
        ref={tooltipRef}
        className={cn(tooltipVariants({ color, size, position }), className)}
        style={tooltipStyle}
        role="tooltip"
        aria-hidden={!isOpen}
      >
        {content}
        {/* 화살표 */}
        {showArrow && (
          <div
            className={cn(
              'absolute w-0 h-0',
              position === 'top' && 'bottom-[-4px] border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent',
              position === 'bottom' && 'top-[-4px] border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent',
              position === 'left' && 'right-[-4px] border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent',
              position === 'right' && 'left-[-4px] border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent',
              arrowColorClasses[color][position]
            )}
            style={arrowStyle}
          />
        )}
      </div>
    );

    return (
      <>
        {triggerElement}
        {!disabled && isOpen && typeof document !== 'undefined'
          ? createPortal(tooltipContent, document.body)
          : null}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

