import React from 'react';
import { cn } from '../../../utils/cn';
import { buttonVariants } from './button.variant';
import type { ButtonProps } from './button.type';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color, buttonStyle, size, className, children, start, end, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ color, buttonStyle, size }), className)}
        {...props}
      >
        {start && (
          <span className={cn('inline-flex items-center', children ? 'mr-2' : '')}>
            {start}
          </span>
        )}
        {children}
        {end && (
          <span className={cn('inline-flex items-center', children ? 'ml-2' : '')}>
            {end}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

