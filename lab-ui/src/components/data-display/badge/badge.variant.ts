import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        neutral: '',
      },
      variant: {
        solid: '',
        outline: 'border bg-transparent',
        soft: '',
      },
      size: {
        xs: 'h-4 px-1.5 text-xs rounded',
        sm: 'h-5 px-2 text-xs rounded-md',
        md: 'h-6 px-2.5 text-sm rounded-md',
        lg: 'h-7 px-3 text-sm rounded-lg',
      },
      dot: {
        true: 'px-0',
        false: '',
      },
      overlay: {
        true: 'absolute z-10',
        false: '',
      },
      hasCount: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Primary Solid
      {
        color: 'primary',
        variant: 'solid',
        class: 'bg-primary-600 text-white',
      },
      // Primary Outline
      {
        color: 'primary',
        variant: 'outline',
        class: 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400',
      },
      // Primary Soft
      {
        color: 'primary',
        variant: 'soft',
        class: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
      },
      // Secondary Solid
      {
        color: 'secondary',
        variant: 'solid',
        class: 'bg-secondary-600 text-white',
      },
      // Secondary Outline
      {
        color: 'secondary',
        variant: 'outline',
        class: 'border-secondary-600 text-secondary-600 dark:border-secondary-500 dark:text-secondary-400',
      },
      // Secondary Soft
      {
        color: 'secondary',
        variant: 'soft',
        class: 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400',
      },
      // Success Solid
      {
        color: 'success',
        variant: 'solid',
        class: 'bg-success-600 text-white',
      },
      // Success Outline
      {
        color: 'success',
        variant: 'outline',
        class: 'border-success-600 text-success-600 dark:border-success-500 dark:text-success-400',
      },
      // Success Soft
      {
        color: 'success',
        variant: 'soft',
        class: 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400',
      },
      // Warning Solid
      {
        color: 'warning',
        variant: 'solid',
        class: 'bg-warning-600 text-white',
      },
      // Warning Outline
      {
        color: 'warning',
        variant: 'outline',
        class: 'border-warning-600 text-warning-600 dark:border-warning-500 dark:text-warning-400',
      },
      // Warning Soft
      {
        color: 'warning',
        variant: 'soft',
        class: 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
      },
      // Danger Solid
      {
        color: 'danger',
        variant: 'solid',
        class: 'bg-error-600 text-white',
      },
      // Danger Outline
      {
        color: 'danger',
        variant: 'outline',
        class: 'border-error-600 text-error-600 dark:border-error-500 dark:text-error-400',
      },
      // Danger Soft
      {
        color: 'danger',
        variant: 'soft',
        class: 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400',
      },
      // Neutral Solid
      {
        color: 'neutral',
        variant: 'solid',
        class: 'bg-neutral-600 text-white dark:bg-neutral-500',
      },
      // Neutral Outline
      {
        color: 'neutral',
        variant: 'outline',
        class: 'border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300',
      },
      // Neutral Soft
      {
        color: 'neutral',
        variant: 'soft',
        class: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      },
      // Dot variants
      {
        dot: true,
        size: 'xs',
        class: 'w-1.5 h-1.5 rounded-full',
      },
      {
        dot: true,
        size: 'sm',
        class: 'w-2 h-2 rounded-full',
      },
      {
        dot: true,
        size: 'md',
        class: 'w-2.5 h-2.5 rounded-full',
      },
      {
        dot: true,
        size: 'lg',
        class: 'w-3 h-3 rounded-full',
      },
      // Overlay count variants - smaller padding for numbers
      {
        overlay: true,
        hasCount: true,
        size: 'xs',
        class: 'min-w-[1rem] h-4 px-1 text-[10px]',
      },
      {
        overlay: true,
        hasCount: true,
        size: 'sm',
        class: 'min-w-[1.25rem] h-5 px-1.5 text-xs',
      },
      {
        overlay: true,
        hasCount: true,
        size: 'md',
        class: 'min-w-[1.5rem] h-6 px-2 text-xs',
      },
      {
        overlay: true,
        hasCount: true,
        size: 'lg',
        class: 'min-w-[1.75rem] h-7 px-2.5 text-sm',
      },
    ],
    defaultVariants: {
      color: 'neutral',
      variant: 'solid',
      size: 'sm',
      dot: false,
      overlay: false,
      hasCount: false,
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

