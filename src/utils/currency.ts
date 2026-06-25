import { CURRENCY } from '../constants/currency';

export function formatCurrency(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${CURRENCY.symbol}${formatted}`;
}

export function parseCurrencyAmount(value: string): number {
  const normalized = value.replace(/[^\d.-]/g, '');
  return Number.parseFloat(normalized);
}
