import React from 'react';
import { cn } from '../../../utils/cn';
import { cardVariants } from './card.variant';
import type { CardProps } from './card.type';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      padding = 'md',
      color = 'default',
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ 
            variant, 
            color,
            size, 
            padding
          }),
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

