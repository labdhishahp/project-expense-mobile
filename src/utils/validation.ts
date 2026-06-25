import { TransactionType, isTransactionType } from '../models';
import { ValidationError } from '../database/errors';
import { ISO_DATE_PATTERN } from './validation.constants';

export function assertPositiveAmount(amount: number, fieldName = 'amount'): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number.`);
  }
}

export function assertNonEmptyString(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new ValidationError(`${fieldName} is required.`);
  }
}

export function assertTransactionType(type: string): asserts type is TransactionType {
  if (!isTransactionType(type)) {
    throw new ValidationError(`type must be INCOME or EXPENSE.`);
  }
}

export function assertISODate(value: string, fieldName = 'date'): void {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new ValidationError(`${fieldName} must be in YYYY-MM-DD format.`);
  }
}

export function assertHexColor(value: string, fieldName = 'color'): void {
  if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
    throw new ValidationError(`${fieldName} must be a valid hex color.`);
  }
}
