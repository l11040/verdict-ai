import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        danger: '',
        neutral: '',
      },
      buttonStyle: {
        solid: '',
        outline: 'border bg-transparent',
        ghost: 'bg-transparent',
      },
      size: {
        '2xs': 'h-5 px-1.5 text-xs rounded',
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
        xl: 'h-14 px-8 text-xl rounded-lg',
        '2xl': 'h-16 px-10 text-2xl rounded-xl',
      },
    },
    compoundVariants: [
      // Primary Solid
      {
        color: 'primary',
        buttonStyle: 'solid',
        class: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      },
      // Primary Outline
      {
        color: 'primary',
        buttonStyle: 'outline',
        class: 'border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-950',
      },
      // Primary Ghost
      {
        color: 'primary',
        buttonStyle: 'ghost',
        class: 'text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-950',
      },
      // Secondary Solid
      {
        color: 'secondary',
        buttonStyle: 'solid',
        class: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
      },
      // Secondary Outline
      {
        color: 'secondary',
        buttonStyle: 'outline',
        class: 'border-secondary-600 text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500 dark:border-secondary-500 dark:text-secondary-400 dark:hover:bg-secondary-950',
      },
      // Secondary Ghost
      {
        color: 'secondary',
        buttonStyle: 'ghost',
        class: 'text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500 dark:text-secondary-400 dark:hover:bg-secondary-950',
      },
      // Danger Solid
      {
        color: 'danger',
        buttonStyle: 'solid',
        class: 'bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500',
      },
      // Danger Outline
      {
        color: 'danger',
        buttonStyle: 'outline',
        class: 'border-error-600 text-error-600 hover:bg-error-50 focus-visible:ring-error-500 dark:border-error-500 dark:text-error-400 dark:hover:bg-error-950',
      },
      // Danger Ghost
      {
        color: 'danger',
        buttonStyle: 'ghost',
        class: 'text-error-600 hover:bg-error-50 focus-visible:ring-error-500 dark:text-error-400 dark:hover:bg-error-950',
      },
      // Neutral Solid
      {
        color: 'neutral',
        buttonStyle: 'solid',
        class: 'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700',
      },
      // Neutral Outline
      {
        color: 'neutral',
        buttonStyle: 'outline',
        class: 'border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
      },
      // Neutral Ghost
      {
        color: 'neutral',
        buttonStyle: 'ghost',
        class: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-500 dark:text-neutral-300 dark:hover:bg-neutral-800',
      },
    ],
    defaultVariants: {
      color: 'primary',
      buttonStyle: 'solid',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

