import { cva, type VariantProps } from 'class-variance-authority';

export const textFieldVariants = cva(
  'w-full font-normal transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none border',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        neutral: '',
      },
      size: {
        xs: 'h-9 px-3 text-sm rounded-lg',
        sm: 'h-10 px-3.5 text-base rounded-lg',
        md: 'h-12 px-4 text-base rounded-xl',
        lg: 'h-14 px-5 text-lg rounded-xl',
        xl: 'h-16 px-6 text-xl rounded-2xl',
      },
      error: {
        true: 'border-error-400 focus-visible:ring-error-400 focus-visible:border-error-400',
        false: '',
      },
      disabled: {
        true: 'bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200 opacity-60 dark:bg-neutral-900/30 dark:text-neutral-500 dark:border-neutral-800',
        false: 'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100',
      },
      hasStartIcon: {
        true: '',
        false: '',
      },
      hasEndIcon: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        color: 'primary',
        error: false,
        disabled: false,
        class: 'border-neutral-300 hover:border-primary-400 focus-visible:ring-primary-500 focus-visible:border-primary-500 dark:border-neutral-700',
      },
      {
        color: 'secondary',
        error: false,
        disabled: false,
        class: 'border-neutral-300 hover:border-secondary-400 focus-visible:ring-secondary-500 focus-visible:border-secondary-500 dark:border-neutral-700',
      },
      {
        color: 'neutral',
        error: false,
        disabled: false,
        class: 'border-neutral-300 hover:border-neutral-400 focus-visible:ring-neutral-500 focus-visible:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-600',
      },
      {
        error: true,
        disabled: false,
        class: 'border-error-400 hover:border-error-500 focus-visible:ring-error-400 focus-visible:border-error-400',
      },
      {
        hasStartIcon: true,
        size: 'xs',
        class: 'pl-8',
      },
      {
        hasStartIcon: true,
        size: 'sm',
        class: 'pl-9',
      },
      {
        hasStartIcon: true,
        size: 'md',
        class: 'pl-10',
      },
      {
        hasStartIcon: true,
        size: 'lg',
        class: 'pl-12',
      },
      {
        hasStartIcon: true,
        size: 'xl',
        class: 'pl-14',
      },
      {
        hasEndIcon: true,
        size: 'xs',
        class: 'pr-8',
      },
      {
        hasEndIcon: true,
        size: 'sm',
        class: 'pr-9',
      },
      {
        hasEndIcon: true,
        size: 'md',
        class: 'pr-10',
      },
      {
        hasEndIcon: true,
        size: 'lg',
        class: 'pr-12',
      },
      {
        hasEndIcon: true,
        size: 'xl',
        class: 'pr-14',
      },
    ],
    defaultVariants: {
      color: 'neutral',
      size: 'md',
      error: false,
      disabled: false,
      hasStartIcon: false,
      hasEndIcon: false,
    },
  }
);

export type TextFieldVariants = VariantProps<typeof textFieldVariants>;

