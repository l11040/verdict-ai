import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva(
  'absolute z-50 px-2 py-1.5 rounded-md text-xs font-medium pointer-events-none transition-opacity duration-200 shadow-lg',
  {
    variants: {
      color: {
        primary: 'bg-primary-600 text-white dark:bg-primary-500',
        secondary: 'bg-secondary-600 text-white dark:bg-secondary-500',
        success: 'bg-success-600 text-white dark:bg-success-500',
        warning: 'bg-warning-600 text-white dark:bg-warning-500',
        danger: 'bg-error-600 text-white dark:bg-error-500',
        neutral: 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-100',
      },
      size: {
        sm: 'text-xs px-2 py-1.5',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-2.5',
      },
      position: {
        top: '',
        bottom: '',
        left: '',
        right: '',
      },
    },
    defaultVariants: {
      color: 'neutral',
      size: 'sm',
      position: 'top',
    },
  }
);

export type TooltipVariants = VariantProps<typeof tooltipVariants>;

