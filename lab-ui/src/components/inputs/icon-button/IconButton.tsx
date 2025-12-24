import React from 'react';
import { cn } from '../../../utils/cn';
import { iconButtonVariants } from './icon-button.variant';
import type { IconButtonProps } from './icon-button.type';

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ color, buttonStyle, size, className, children, icon, ...props }, ref) => {
    const iconElement = icon || children;

    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ color, buttonStyle, size }), className)}
        {...props}
      >
        {iconElement && (
          <span className="inline-flex items-center justify-center">
            {iconElement}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

