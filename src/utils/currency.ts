import { CURRENCY } from '../constants/currency';
import { TransactionType, type TransactionType as TransactionTypeValue } from '../models';

export function formatCurrency(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${CURRENCY.symbol}${formatted}`;
}

export function formatSignedCurrency(
  amount: number,
  type: TransactionTypeValue,
): string {
  const formatted = formatCurrency(amount);
  return type === TransactionType.INCOME ? `+${formatted}` : `-${formatted}`;
}

export function parseCurrencyAmount(value: string): number {
  const normalized = value.replace(/[^\d.-]/g, '');
  return Number.parseFloat(normalized);
}
