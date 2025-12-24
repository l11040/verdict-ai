/**
 * Tailwind CSS theme 확장 설정
 * 
 * 사용 방법:
 * ```ts
 * import { labUITheme } from '@lab/ui/tokens/tailwind.config'
 * 
 * export default {
 *   theme: {
 *     extend: labUITheme,
 *   },
 * }
 * ```
 */
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { borders } from './borders';

export const labUITheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    neutral: colors.neutral,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    text: colors.text,
    background: colors.background,
    border: colors.border,
    dark: colors.dark,
  },
  fontFamily: {
    sans: [...typography.fontFamily.sans],
    mono: [...typography.fontFamily.mono],
  },
  fontSize: {
    xs: [...typography.fontSize.xs] as [string, { lineHeight: string }],
    sm: [...typography.fontSize.sm] as [string, { lineHeight: string }],
    base: [...typography.fontSize.base] as [string, { lineHeight: string }],
    lg: [...typography.fontSize.lg] as [string, { lineHeight: string }],
    xl: [...typography.fontSize.xl] as [string, { lineHeight: string }],
    '2xl': [...typography.fontSize['2xl']] as [string, { lineHeight: string }],
    '3xl': [...typography.fontSize['3xl']] as [string, { lineHeight: string }],
    '4xl': [...typography.fontSize['4xl']] as [string, { lineHeight: string }],
    '5xl': [...typography.fontSize['5xl']] as [string, { lineHeight: string }],
    '6xl': [...typography.fontSize['6xl']] as [string, { lineHeight: string }],
    '7xl': [...typography.fontSize['7xl']] as [string, { lineHeight: string }],
    '8xl': [...typography.fontSize['8xl']] as [string, { lineHeight: string }],
    '9xl': [...typography.fontSize['9xl']] as [string, { lineHeight: string }],
  },
  fontWeight: typography.fontWeight,
  letterSpacing: typography.letterSpacing,
  lineHeight: typography.lineHeight,
  spacing: spacing,
  boxShadow: shadows,
  borderRadius: borders.radius,
  borderWidth: borders.width,
};

// 하위 호환성을 위한 default export
const tailwindConfig = {
  theme: {
    extend: labUITheme,
  },
};

export default tailwindConfig;

