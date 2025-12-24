/**
 * 디자인 토큰 통합 export
 */
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './borders';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { borders } from './borders';

/**
 * 모든 디자인 토큰을 포함하는 객체
 */
export const tokens = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
} as const;

export type Tokens = typeof tokens;

