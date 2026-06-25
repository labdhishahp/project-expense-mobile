export const DEFAULT_CATEGORY_NAMES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Salary',
  'Investment',
  'Health',
  'Education',
  'Other',
] as const;

export type DefaultCategoryName = (typeof DEFAULT_CATEGORY_NAMES)[number];

export const DEFAULT_CATEGORIES: ReadonlyArray<{
  name: DefaultCategoryName;
  icon: string;
  color: string;
}> = [
  { name: 'Food', icon: 'restaurant-outline', color: '#EF4444' },
  { name: 'Travel', icon: 'airplane-outline', color: '#3B82F6' },
  { name: 'Shopping', icon: 'cart-outline', color: '#8B5CF6' },
  { name: 'Bills', icon: 'receipt-outline', color: '#F59E0B' },
  { name: 'Entertainment', icon: 'film-outline', color: '#EC4899' },
  { name: 'Salary', icon: 'wallet-outline', color: '#16A34A' },
  { name: 'Investment', icon: 'trending-up-outline', color: '#0D9488' },
  { name: 'Health', icon: 'medkit-outline', color: '#06B6D4' },
  { name: 'Education', icon: 'school-outline', color: '#6366F1' },
  { name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#64748B' },
];
