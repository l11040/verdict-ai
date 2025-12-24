import React, { useImperativeHandle, useRef } from 'react';
import { cn } from '../../../utils/cn';
import { selectTriggerVariants } from './select.variant';
import type { SelectProps } from './select.type';
import { useDropdownPosition } from '../../../hooks/useDropdownPosition';
import { useSelect } from './useSelect';

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      disabled = false,
      error = false,
      errorMessage,
      size = 'md',
      color = 'neutral',
      preferredPosition = 'bottom',
      className,
      ...props
    },
    ref
  ) => {
    const {
      isOpen,
      selectedOption,
      triggerRef,
      dropdownRef,
      containerRef,
      handleToggle,
      handleSelect,
    } = useSelect({
      options,
      value,
      onChange,
      disabled,
    });

    // 외부에서 전달된 ref와 내부 ref를 병합
    const wrapperRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement, []);

    const { position, top, bottom, left, width, useFixed, fixedLeft } = useDropdownPosition({
      triggerRef,
      dropdownRef,
      isOpen,
      preferredPosition,
    });


    return (
      <div ref={wrapperRef} className={cn('relative', className)} {...props}>
        <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            selectTriggerVariants({
              color,
              size,
              error,
              disabled,
            }),
            isOpen && !disabled && (
              error 
                ? 'border-error-400 ring-2 ring-error-400 ring-offset-0'
                : color === 'primary' ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-0' :
                  color === 'secondary' ? 'border-secondary-500 ring-2 ring-secondary-500 ring-offset-0' :
                  'border-neutral-500 ring-2 ring-neutral-500 ring-offset-0'
            )
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn('flex-1 text-left truncate', disabled ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100', !selectedOption && !disabled && 'text-neutral-500 dark:text-neutral-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn(
              'ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-150',
              disabled ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400',
              isOpen && 'rotate-180',
              size === 'xs' && 'h-3.5 w-3.5',
              size === 'sm' && 'h-4 w-4',
              size === 'lg' && 'h-5 w-5',
              size === 'xl' && 'h-6 w-6'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-[99999] max-h-60 overflow-auto border border-neutral-200 bg-white shadow-md py-1 dark:border-neutral-700 dark:bg-neutral-900',
              size === 'xs' && 'rounded-lg',
              size === 'sm' && 'rounded-lg',
              size === 'md' && 'rounded-xl',
              size === 'lg' && 'rounded-xl',
              size === 'xl' && 'rounded-2xl'
            )}
            style={{
              ...(useFixed
                ? {
                    position: 'fixed',
                    ...(position === 'top' && bottom !== undefined ? { bottom: `${bottom}px` } : {}),
                    ...(position === 'bottom' && top !== undefined ? { top: `${top}px` } : {}),
                    ...(fixedLeft !== undefined ? { left: `${fixedLeft}px` } : {}),
                  }
                : {
                    position: 'absolute',
                    ...(position === 'top' ? { bottom: '100%', marginBottom: '4px' } : { top: '100%', marginTop: '4px' }),
                    ...(left !== undefined ? { left: `${left}px` } : {}),
                  }),
              ...(width !== undefined ? { width: `${width}px` } : {}),
            }}
            role="listbox"
          >
            {options.length === 0 ? (
              <div className="px-4 py-2.5 text-sm text-neutral-400">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 text-left text-sm transition-colors duration-150',
                    'focus:outline-none',
                    option.value === value
                      ? color === 'primary'
                        ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/20 dark:text-primary-400'
                        : color === 'secondary'
                        ? 'bg-secondary-50 text-secondary-700 font-medium dark:bg-secondary-900/20 dark:text-secondary-400'
                        : 'bg-neutral-100 text-neutral-900 font-medium dark:bg-neutral-800 dark:text-neutral-100'
                      : 'text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
                    option.disabled &&
                      'cursor-not-allowed opacity-40 text-neutral-400 hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent',
                    size === 'xs' && 'py-2 text-xs',
                    size === 'sm' && 'py-2.5',
                    size === 'md' && 'py-3 text-base',
                    size === 'lg' && 'py-3.5 text-lg',
                    size === 'xl' && 'py-4 text-xl'
                  )}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
        </div>
        {error && errorMessage && (
          <div className={cn(
            'mt-1.5 text-sm text-error-400',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-xs',
            size === 'xl' && 'text-base'
          )}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

