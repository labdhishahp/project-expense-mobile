const palette = {
  blue50: '#EFF6FF',
  blue500: '#2563EB',
  blue600: '#1D4ED8',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate900: '#0F172A',
  white: '#FFFFFF',
  green600: '#16A34A',
  red600: '#DC2626',
  amber600: '#D97706',
  slate950: '#020617',
  slate800: '#1E293B',
  slate700: '#334155',
  slate300: '#CBD5E1',
} as const;

export const lightColors = {
  primary: palette.blue500,
  primaryDark: palette.blue600,
  primaryMuted: palette.blue50,

  background: palette.slate50,
  surface: palette.white,
  surfaceElevated: palette.white,

  text: palette.slate900,
  textSecondary: palette.slate500,
  textMuted: palette.slate400,
  textInverse: palette.white,

  border: palette.slate200,
  divider: palette.slate100,

  tabBarActive: palette.blue500,
  tabBarInactive: palette.slate400,
  tabBarBackground: palette.white,
  tabBarBorder: palette.slate200,

  success: palette.green600,
  error: palette.red600,
  warning: palette.amber600,

  overlay: 'rgba(15, 23, 42, 0.4)',
} as const;

export const darkColors = {
  primary: palette.blue500,
  primaryDark: palette.blue600,
  primaryMuted: '#1E3A5F',

  background: palette.slate950,
  surface: palette.slate900,
  surfaceElevated: palette.slate800,

  text: palette.slate50,
  textSecondary: palette.slate300,
  textMuted: palette.slate400,
  textInverse: palette.slate900,

  border: palette.slate700,
  divider: palette.slate800,

  tabBarActive: palette.blue500,
  tabBarInactive: palette.slate400,
  tabBarBackground: palette.slate900,
  tabBarBorder: palette.slate800,

  success: palette.green600,
  error: palette.red600,
  warning: palette.amber600,

  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const themes = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ThemeMode = keyof typeof themes;
export type ThemeColors = typeof lightColors;
export type ColorName = keyof ThemeColors;

/** Active palette. Swap to `themes.dark` when dark mode is implemented. */
export const colors = themes.light;
