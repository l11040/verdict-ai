import React from 'react';
import { cn } from '../../../utils/cn';
import { badgeVariants } from './badge.variant';
import type { BadgeProps } from './badge.type';

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      color = 'neutral',
      variant = 'solid',
      size = 'sm',
      children,
      startIcon,
      endIcon,
      dot = false,
      count,
      maxCount = 99,
      overlay = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Count가 있으면 count를 표시, 없으면 children 표시
    const displayContent = count !== undefined ? (count > maxCount ? `${maxCount}+` : String(count)) : children;
    const hasCount = count !== undefined;

    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            badgeVariants({ color, variant, size, dot: true, overlay, hasCount: false }),
            className
          )}
          style={style}
          {...props}
        />
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ color, variant, size, dot: false, overlay, hasCount }),
          className
        )}
        style={style}
        {...props}
      >
        {startIcon && (
          <span className={cn('inline-flex items-center', displayContent ? 'mr-1.5' : '')}>
            {startIcon}
          </span>
        )}
        {displayContent}
        {endIcon && (
          <span className={cn('inline-flex items-center', displayContent ? 'ml-1.5' : '')}>
            {endIcon}
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

