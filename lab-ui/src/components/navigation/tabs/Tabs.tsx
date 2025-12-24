import React from 'react';
import { cn } from '../../../utils/cn';
import { tabsListVariants, tabVariants } from './tabs.variant';
import type { TabsProps, TabPanelProps } from './tabs.type';
import { useTabsValue } from './useTabsValue';
import { useTabIndicator } from './useTabIndicator';
import { useTabClick } from './useTabClick';

const UNDERLINE_COLOR_CLASSES = {
  primary: 'bg-primary-500 dark:bg-primary-400',
  secondary: 'bg-secondary-500 dark:bg-secondary-400',
  success: 'bg-success-500 dark:bg-success-400',
  warning: 'bg-warning-500 dark:bg-warning-400',
  danger: 'bg-error-500 dark:bg-error-400',
  neutral: 'bg-neutral-800 dark:bg-neutral-200',
} as const;

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      value,
      onChange,
      defaultValue,
      variant = 'pills',
      size = 'md',
      color = 'primary',
      disabled = false,
      orientation = 'horizontal',
      className,
      tabsListClassName,
      ...props
    },
    ref
  ) => {
    const { activeValue, handleChange } = useTabsValue({ value, defaultValue, onChange });
    const { indicatorStyle, tabsListRef, setTabRef } = useTabIndicator({
      variant,
      color,
      orientation,
      activeValue,
      items,
    });
    const handleTabClick = useTabClick({
      disabled,
      onChange: handleChange,
    });

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          ref={tabsListRef}
          className={cn(
            tabsListVariants({ variant, orientation }),
            tabsListClassName
          )}
          role="tablist"
          aria-orientation={orientation}
        >
          {variant === 'pills' && (
            <div
              className={cn(
                'absolute rounded-lg z-0 pointer-events-none',
                orientation === 'horizontal' && 'top-1',
                orientation === 'vertical' && 'left-1',
                'bg-white dark:bg-neutral-800'
              )}
              style={indicatorStyle}
            />
          )}
          {variant === 'underline' && (
            <div
              className={cn(
                'absolute z-10 pointer-events-none rounded-t-full',
                orientation === 'horizontal' && 'bottom-0',
                orientation === 'vertical' && 'right-0',
                UNDERLINE_COLOR_CLASSES[color]
              )}
              style={indicatorStyle}
            />
          )}
          {items.map((item) => {
            const isActive = activeValue === item.id;
            const isDisabled = disabled || item.disabled;

            return (
              <button
                key={item.id}
                ref={(node) => setTabRef(item.id, node)}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-disabled={isDisabled}
                disabled={isDisabled}
                onClick={() => handleTabClick(item.id, item.disabled ?? false)}
                className={cn(
                  tabVariants({
                    variant,
                    size,
                    orientation,
                    isActive: variant === 'underline' ? false : isActive, // underline만 indicator로 처리
                    color,
                  }),
                  '!outline-none active:!outline-none focus:!outline-none focus-visible:!outline-none !ring-0 active:!ring-0 focus:!ring-0 focus-visible:!ring-0',
                  variant === 'pills' && 'relative z-10 !bg-transparent active:!bg-transparent focus:!bg-transparent focus-visible:!bg-transparent hover:!bg-transparent',
                  variant === 'underline' && 'relative z-0 !border-b-0 !border-b-transparent',
                  orientation === 'horizontal' && variant === 'pills' && 'flex-1',
                  orientation === 'vertical' && 'w-full'
                )}
              >
                {item.startIcon && (
                  <span className="inline-flex items-center">{item.startIcon}</span>
                )}
                <span>{item.label}</span>
                {item.endIcon && (
                  <span className="inline-flex items-center">{item.endIcon}</span>
                )}
                {item.badge && (
                  <span className="ml-1.5 inline-flex items-center">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';

