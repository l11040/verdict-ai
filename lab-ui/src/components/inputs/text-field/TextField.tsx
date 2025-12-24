import React from 'react';
import { cn } from '../../../utils/cn';
import { textFieldVariants } from './text-field.variant';
import type { TextFieldProps } from './text-field.type';

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      size = 'md',
      color = 'neutral',
      startIcon,
      endIcon,
      className,
      inputClassName,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const hasStartIcon = !!startIcon;
    const hasEndIcon = !!endIcon;

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label
            className={cn(
              'block mb-1.5 font-medium',
              error ? 'text-error-600 dark:text-error-400' : 'text-neutral-700 dark:text-neutral-300',
              disabled && 'text-neutral-400 dark:text-neutral-500',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div
              className={cn(
                'absolute left-0 top-0 flex items-center pointer-events-none',
                disabled ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-500 dark:text-neutral-400',
                size === 'xs' && 'h-9 pl-3',
                size === 'sm' && 'h-10 pl-3.5',
                size === 'md' && 'h-12 pl-4',
                size === 'lg' && 'h-14 pl-5',
                size === 'xl' && 'h-16 pl-6'
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center',
                  size === 'xs' && 'h-3.5 w-3.5',
                  size === 'sm' && 'h-4 w-4',
                  size === 'md' && 'h-5 w-5',
                  size === 'lg' && 'h-6 w-6',
                  size === 'xl' && 'h-7 w-7'
                )}
              >
                {startIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              textFieldVariants({
                color,
                size,
                error,
                disabled,
                hasStartIcon,
                hasEndIcon,
              }),
              inputClassName
            )}
            {...props}
          />
          {endIcon && (
            <div
              className={cn(
                'absolute right-0 top-0 flex items-center pointer-events-none',
                disabled ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-500 dark:text-neutral-400',
                size === 'xs' && 'h-9 pr-3',
                size === 'sm' && 'h-10 pr-3.5',
                size === 'md' && 'h-12 pr-4',
                size === 'lg' && 'h-14 pr-5',
                size === 'xl' && 'h-16 pr-6'
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center',
                  size === 'xs' && 'h-3.5 w-3.5',
                  size === 'sm' && 'h-4 w-4',
                  size === 'md' && 'h-5 w-5',
                  size === 'lg' && 'h-6 w-6',
                  size === 'xl' && 'h-7 w-7'
                )}
              >
                {endIcon}
              </span>
            </div>
          )}
        </div>
        {error && errorMessage && (
          <div
            className={cn(
              'mt-1.5 text-sm text-error-400',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'xl' && 'text-base'
            )}
          >
            {errorMessage}
          </div>
        )}
        {!error && helperText && (
          <div
            className={cn(
              'mt-1.5 text-sm text-neutral-500 dark:text-neutral-400',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'xl' && 'text-base'
            )}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

