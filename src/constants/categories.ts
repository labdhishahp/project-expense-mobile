export const EXPENSE_DEFAULT_CATEGORY_NAMES = [
  'Shopping',
  'Travel',
  'Food',
  'Skincare',
  'Other',
] as const;

export const INCOME_CATEGORY_NAME = 'Income';

export const DEFAULT_CATEGORY_NAMES = [
  ...EXPENSE_DEFAULT_CATEGORY_NAMES,
  INCOME_CATEGORY_NAME,
] as const;

export type DefaultCategoryName = (typeof DEFAULT_CATEGORY_NAMES)[number];
export type ExpenseDefaultCategoryName = (typeof EXPENSE_DEFAULT_CATEGORY_NAMES)[number];

export const DEFAULT_CATEGORIES: ReadonlyArray<{
  name: DefaultCategoryName;
  icon: string;
  color: string;
}> = [
  { name: 'Shopping', icon: 'cart-outline', color: '#8B5CF6' },
  { name: 'Travel', icon: 'airplane-outline', color: '#3B82F6' },
  { name: 'Food', icon: 'restaurant-outline', color: '#EF4444' },
  { name: 'Skincare', icon: 'sparkles-outline', color: '#EC4899' },
  { name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#64748B' },
  { name: 'Income', icon: 'wallet-outline', color: '#16A34A' },
];

const ALLOWED_DEFAULT_CATEGORY_NAMES = new Set<string>(
  DEFAULT_CATEGORY_NAMES.map((name) => name.toLowerCase()),
);

export function isIncomeCategoryName(name: string): boolean {
  return name.toLowerCase() === INCOME_CATEGORY_NAME.toLowerCase();
}

export function isExpenseDefaultCategoryName(name: string): boolean {
  return EXPENSE_DEFAULT_CATEGORY_NAMES.some(
    (categoryName) => categoryName.toLowerCase() === name.toLowerCase(),
  );
}

export function isAllowedDefaultCategoryName(name: string): boolean {
  return ALLOWED_DEFAULT_CATEGORY_NAMES.has(name.toLowerCase());
}

export function sortExpenseCategories<T extends { name: string }>(categories: T[]): T[] {
  return [...categories].sort((left, right) => {
    const leftIndex = EXPENSE_DEFAULT_CATEGORY_NAMES.findIndex(
      (name) => name.toLowerCase() === left.name.toLowerCase(),
    );
    const rightIndex = EXPENSE_DEFAULT_CATEGORY_NAMES.findIndex(
      (name) => name.toLowerCase() === right.name.toLowerCase(),
    );
    return leftIndex - rightIndex;
  });
}
