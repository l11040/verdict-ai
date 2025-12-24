import { cva, type VariantProps } from 'class-variance-authority';

export const tabsListVariants = cva(
  'flex transition-colors',
  {
    variants: {
      variant: {
        pills: 'bg-neutral-50 dark:bg-neutral-900/50 p-1 rounded-xl relative',
        underline: 'border-b border-neutral-100 dark:border-neutral-800 relative',
        enclosed: 'bg-neutral-50 dark:bg-neutral-900/30 p-1 rounded-xl relative gap-1',
        chip: 'gap-2',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      variant: 'pills',
      orientation: 'horizontal',
    },
  }
);

export const tabVariants = cva(
  'relative flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:bg-transparent',
  {
    variants: {
      variant: {
        pills: 'rounded-md z-10',
        underline: 'border-b-2 border-transparent rounded-t-md',
        enclosed: 'rounded-lg',
        chip: 'rounded-full border',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
      isActive: {
        true: '',
        false: '',
      },
      color: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        neutral: '',
      },
    },
    compoundVariants: [
      // Pills variant - 배경은 별도 indicator로 처리하므로 배경색 제거
      {
        variant: 'pills',
        isActive: true,
        color: 'primary',
        class: 'text-primary-800 dark:text-primary-400 font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        color: 'primary',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'pills',
        isActive: true,
        color: 'secondary',
        class: 'text-secondary-800 dark:text-secondary-400 font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        color: 'secondary',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'pills',
        isActive: true,
        color: 'success',
        class: 'text-success-800 dark:text-success-400 font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        color: 'success',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'pills',
        isActive: true,
        color: 'warning',
        class: 'text-warning-700 dark:text-warning-400 font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        color: 'warning',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'pills',
        isActive: true,
        color: 'danger',
        class: 'text-error-800 dark:text-error-400 font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        color: 'danger',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'pills',
        isActive: true,
        color: 'neutral',
        class: 'text-neutral-900 dark:text-neutral-100 font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        color: 'neutral',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      // Underline variant
      {
        variant: 'underline',
        isActive: true,
        color: 'primary',
        class: 'border-b-primary-500 dark:border-b-primary-400 text-primary-800 dark:text-primary-400 font-semibold',
      },
      {
        variant: 'underline',
        isActive: false,
        color: 'primary',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-b-neutral-200 dark:hover:border-b-neutral-700',
      },
      {
        variant: 'underline',
        isActive: true,
        color: 'secondary',
        class: 'border-b-secondary-500 dark:border-b-secondary-400 text-secondary-800 dark:text-secondary-400 font-semibold',
      },
      {
        variant: 'underline',
        isActive: false,
        color: 'secondary',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-b-neutral-200 dark:hover:border-b-neutral-700',
      },
      {
        variant: 'underline',
        isActive: true,
        color: 'success',
        class: 'border-b-success-500 dark:border-b-success-400 text-success-800 dark:text-success-400 font-semibold',
      },
      {
        variant: 'underline',
        isActive: false,
        color: 'success',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-b-neutral-200 dark:hover:border-b-neutral-700',
      },
      {
        variant: 'underline',
        isActive: true,
        color: 'warning',
        class: 'border-b-warning-500 dark:border-b-warning-400 text-warning-700 dark:text-warning-400 font-semibold',
      },
      {
        variant: 'underline',
        isActive: false,
        color: 'warning',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-b-neutral-200 dark:hover:border-b-neutral-700',
      },
      {
        variant: 'underline',
        isActive: true,
        color: 'danger',
        class: 'border-b-error-500 dark:border-b-error-400 text-error-800 dark:text-error-400 font-semibold',
      },
      {
        variant: 'underline',
        isActive: false,
        color: 'danger',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-b-neutral-200 dark:hover:border-b-neutral-700',
      },
      {
        variant: 'underline',
        isActive: true,
        color: 'neutral',
        class: 'border-b-neutral-800 dark:border-b-neutral-200 text-neutral-900 dark:text-neutral-100 font-semibold',
      },
      {
        variant: 'underline',
        isActive: false,
        color: 'neutral',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-b-neutral-200 dark:hover:border-b-neutral-700',
      },
      // Enclosed variant - pills와 유사하지만 더 부드러운 배경색
      {
        variant: 'enclosed',
        isActive: true,
        color: 'primary',
        class: 'bg-white dark:bg-neutral-800 text-primary-800 dark:text-primary-400 font-semibold shadow-sm',
      },
      {
        variant: 'enclosed',
        isActive: false,
        color: 'primary',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'enclosed',
        isActive: true,
        color: 'secondary',
        class: 'bg-white dark:bg-neutral-800 text-secondary-800 dark:text-secondary-400 font-semibold shadow-sm',
      },
      {
        variant: 'enclosed',
        isActive: false,
        color: 'secondary',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'enclosed',
        isActive: true,
        color: 'success',
        class: 'bg-white dark:bg-neutral-800 text-success-800 dark:text-success-400 font-semibold shadow-sm',
      },
      {
        variant: 'enclosed',
        isActive: false,
        color: 'success',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'enclosed',
        isActive: true,
        color: 'warning',
        class: 'bg-white dark:bg-neutral-800 text-warning-700 dark:text-warning-400 font-semibold shadow-sm',
      },
      {
        variant: 'enclosed',
        isActive: false,
        color: 'warning',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'enclosed',
        isActive: true,
        color: 'danger',
        class: 'bg-white dark:bg-neutral-800 text-error-800 dark:text-error-400 font-semibold shadow-sm',
      },
      {
        variant: 'enclosed',
        isActive: false,
        color: 'danger',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'enclosed',
        isActive: true,
        color: 'neutral',
        class: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-sm',
      },
      {
        variant: 'enclosed',
        isActive: false,
        color: 'neutral',
        class: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      // Chip variant
      {
        variant: 'chip',
        isActive: true,
        color: 'primary',
        class: 'bg-primary-500 text-white border-primary-500 dark:bg-primary-400 dark:border-primary-400 shadow-sm font-medium',
      },
      {
        variant: 'chip',
        isActive: false,
        color: 'primary',
        class: 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'chip',
        isActive: true,
        color: 'secondary',
        class: 'bg-secondary-500 text-white border-secondary-500 dark:bg-secondary-400 dark:border-secondary-400 shadow-sm font-medium',
      },
      {
        variant: 'chip',
        isActive: false,
        color: 'secondary',
        class: 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'chip',
        isActive: true,
        color: 'success',
        class: 'bg-success-500 text-white border-success-500 dark:bg-success-400 dark:border-success-400 shadow-sm font-medium',
      },
      {
        variant: 'chip',
        isActive: false,
        color: 'success',
        class: 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'chip',
        isActive: true,
        color: 'warning',
        class: 'bg-warning-500 text-white border-warning-500 dark:bg-warning-400 dark:border-warning-400 shadow-sm font-medium',
      },
      {
        variant: 'chip',
        isActive: false,
        color: 'warning',
        class: 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'chip',
        isActive: true,
        color: 'danger',
        class: 'bg-error-500 text-white border-error-500 dark:bg-error-400 dark:border-error-400 shadow-sm font-medium',
      },
      {
        variant: 'chip',
        isActive: false,
        color: 'danger',
        class: 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
      {
        variant: 'chip',
        isActive: true,
        color: 'neutral',
        class: 'bg-neutral-800 text-white border-neutral-800 dark:bg-neutral-200 dark:text-neutral-900 dark:border-neutral-200 shadow-sm font-medium',
      },
      {
        variant: 'chip',
        isActive: false,
        color: 'neutral',
        class: 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200',
      },
    ],
    defaultVariants: {
      variant: 'pills',
      size: 'md',
      orientation: 'horizontal',
      isActive: false,
      color: 'primary',
    },
  }
);

export type TabsListVariants = VariantProps<typeof tabsListVariants>;
export type TabVariants = VariantProps<typeof tabVariants>;

