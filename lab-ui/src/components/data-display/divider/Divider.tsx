import React from 'react';
import { cn } from '../../../utils/cn';
import { dividerVariants } from './divider.variant';
import type { DividerProps } from './divider.type';

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      color = 'neutral',
      size = 'xs',
      label,
      labelPosition = 'center',
      className,
      style,
      ...props
    },
    ref
  ) => {
    // 수직 방향일 때는 label을 무시하고 div로 렌더링
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(dividerVariants({ orientation, variant, color, size }), className)}
          style={style}
          role="separator"
          aria-orientation="vertical"
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }

    // 수평 방향이고 label이 있는 경우
    if (label) {
      return (
        <div
          className={cn('flex items-center w-full', className)}
          style={style}
        >
          <hr
            ref={ref}
            className={cn(
              dividerVariants({ orientation, variant, color, size }),
              'flex-1',
              labelPosition === 'left' && 'hidden',
              labelPosition === 'right' && 'order-2'
            )}
            {...props}
          />
          <span
            className={cn(
              'px-3 text-sm text-neutral-600 dark:text-neutral-400',
              labelPosition === 'left' && 'pr-3',
              labelPosition === 'right' && 'pl-3 order-1'
            )}
          >
            {label}
          </span>
          {labelPosition !== 'right' && (
            <hr
              className={cn(
                dividerVariants({ orientation, variant, color, size }),
                'flex-1',
                labelPosition === 'left' && 'order-2'
              )}
            />
          )}
        </div>
      );
    }

    // 수평 방향이고 label이 없는 경우
    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ orientation, variant, color, size }), className)}
        style={style}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

