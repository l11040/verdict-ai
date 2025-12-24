import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'h-full min-h-[1.5rem] border-l inline-block align-middle',
    },
    variant: {
      solid: '',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    },
    color: {
      primary: 'border-primary-300 dark:border-primary-700',
      secondary: 'border-secondary-300 dark:border-secondary-700',
      success: 'border-success-300 dark:border-success-700',
      warning: 'border-warning-300 dark:border-warning-700',
      danger: 'border-error-300 dark:border-error-700',
      neutral: 'border-neutral-100 dark:border-neutral-800',
    },
    size: {
      xs: 'border-[0.5px] opacity-60',
      sm: 'border-[0.5px]',
      md: 'border-2',
      lg: 'border-[3px]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    color: 'neutral',
    size: 'xs',
  },
});

export type DividerVariants = VariantProps<typeof dividerVariants>;

