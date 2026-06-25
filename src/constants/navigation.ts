import type { MainTabParamList } from '../types';

export const TAB_ROUTES = {
  Home: 'Home',
  Transactions: 'Transactions',
  Settings: 'Settings',
} as const satisfies Record<keyof MainTabParamList, keyof MainTabParamList>;

export const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Home: 'Home',
  Transactions: 'Transactions',
  Settings: 'Settings',
};
