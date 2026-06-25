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
