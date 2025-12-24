/**
 * 색상 디자인 토큰
 * 토스 스타일을 참고하여 주황색을 메인 컬러로 사용
 * 라이트 테마 기준으로 구성, 다크 테마는 reverse로 제공
 */
export const colors = {
  // 텍스트 색상 (라이트 테마 기준)
  text: {
    primary: '#212121',      // 기본 텍스트 (neutral-900)
    secondary: '#616161',    // 보조 텍스트 (neutral-700)
    tertiary: '#9e9e9e',     // 3차 텍스트 (neutral-500)
    disabled: '#bdbdbd',     // 비활성화 텍스트 (neutral-400)
    inverse: '#ffffff',      // 반전 텍스트 (흰색 배경 위)
    onPrimary: '#ffffff',    // Primary 색상 위 텍스트
    onSecondary: '#ffffff',  // Secondary 색상 위 텍스트
    onError: '#ffffff',      // Error 색상 위 텍스트
  },
  // 배경 색상 (라이트 테마 기준)
  background: {
    default: '#ffffff',      // 기본 배경
    paper: '#fafafa',        // 카드/페이퍼 배경 (neutral-50)
    elevated: '#ffffff',      // 올라간 요소 배경
    overlay: 'rgba(0, 0, 0, 0.5)', // 오버레이 배경
  },
  // 테두리 색상 (라이트 테마 기준)
  border: {
    default: '#e0e0e0',     // 기본 테두리 (neutral-300)
    light: '#f5f5f5',        // 밝은 테두리 (neutral-100)
    medium: '#bdbdbd',       // 중간 테두리 (neutral-400)
    dark: '#757575',         // 어두운 테두리 (neutral-600)
  },
  // Primary 색상 팔레트 (주황색 - 토스 스타일: 부드럽고 세련된 톤)
  primary: {
    50: '#fff8f0',
    100: '#ffedd5',
    200: '#ffd9b3',
    300: '#ffc085',
    400: '#ffa64d',
    500: '#ff8c1a',
    600: '#ff7700',
    700: '#e65c00',
    800: '#cc4d00',
    900: '#b33d00',
    950: '#802900',
  },
  // Secondary 색상 팔레트 (토스 스타일: 파스텔 톤의 하늘색 - 주황색과 조화)
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  // Neutral/Gray 색상 팔레트 (토스 스타일: 매우 부드러운 그레이)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0a0a0a',
  },
  // Semantic 색상
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef1f2',
    100: '#fee1e3',
    200: '#fec8cc',
    300: '#fda4a9',
    400: '#fb7079',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // 다크 테마 색상 (Reverse)
  dark: {
    // 텍스트 색상 (다크 테마)
    text: {
      primary: '#ffffff',      // 기본 텍스트 (흰색)
      secondary: '#bdbdbd',    // 보조 텍스트 (neutral-400)
      tertiary: '#757575',     // 3차 텍스트 (neutral-600)
      disabled: '#616161',     // 비활성화 텍스트 (neutral-700)
      inverse: '#212121',      // 반전 텍스트 (다크 배경 위)
      onPrimary: '#ffffff',    // Primary 색상 위 텍스트
      onSecondary: '#ffffff',  // Secondary 색상 위 텍스트
      onError: '#ffffff',      // Error 색상 위 텍스트
    },
    // 배경 색상 (다크 테마)
    background: {
      default: '#0a0a0a',      // 기본 배경 (neutral-950)
      paper: '#171717',         // 카드/페이퍼 배경 (neutral-900)
      elevated: '#212121',      // 올라간 요소 배경 (neutral-800)
      overlay: 'rgba(0, 0, 0, 0.8)', // 오버레이 배경
    },
    // 테두리 색상 (다크 테마)
    border: {
      default: '#424242',      // 기본 테두리 (neutral-800)
      light: '#616161',         // 밝은 테두리 (neutral-700)
      medium: '#757575',        // 중간 테두리 (neutral-600)
      dark: '#9e9e9e',          // 어두운 테두리 (neutral-500)
    },
  },
} as const;

export type ColorPalette = typeof colors;
export type ColorName = keyof ColorPalette;
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

