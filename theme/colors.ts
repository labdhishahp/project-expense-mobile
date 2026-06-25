export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',

  background: '#F8FAFC',
  surface: '#FFFFFF',

  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  border: '#E2E8F0',
  divider: '#F1F5F9',

  tabBarActive: '#2563EB',
  tabBarInactive: '#94A3B8',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',

  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
} as const;

export type ColorName = keyof typeof colors;
