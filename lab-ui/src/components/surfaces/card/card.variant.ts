import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'rounded-lg transition-all duration-200 border',
  {
    variants: {
      variant: {
        outlined: 'bg-transparent',
        filled: 'bg-neutral-50 dark:bg-neutral-900 border-transparent',
        elevated: 'bg-white dark:bg-neutral-800 border-transparent shadow-[0_4px_12px_0px_rgba(0,0,0,0.25),0_2px_6px_0px_rgba(0,0,0,0.2)]',
      },
      color: {
        default: '',
        primary: 'border-primary-500',
        secondary: 'border-secondary-500',
        success: 'border-success-500',
        warning: 'border-warning-500',
        danger: 'border-error-500',
        neutral: 'border-neutral-300 dark:border-neutral-700',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    compoundVariants: [
      {
        variant: 'outlined',
        color: 'default',
        class: 'border-neutral-300 dark:border-neutral-700',
      },
      {
        variant: 'filled',
        color: 'default',
        class: 'border-transparent',
      },
      {
        variant: 'elevated',
        color: 'default',
        class: 'border-transparent',
      },
    ],
    defaultVariants: {
      variant: 'outlined',
      color: 'default',
      size: 'md',
      padding: 'md',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;

