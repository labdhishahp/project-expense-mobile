export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
} as const;

export type Currency = typeof CURRENCY.code;
