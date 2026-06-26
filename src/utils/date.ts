import type { MonthKey } from '../models';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(value: string): string {
  const date = parseISODate(value);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(value: string): string {
  const date = parseISODate(value);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTodayISODate(): string {
  return toISODateString(new Date());
}

export function getMonthKey(date: Date = new Date()): MonthKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthDateRange(month: MonthKey): { start: string; end: string } {
  const [year, monthPart] = month.split('-').map(Number);
  const start = `${year}-${String(monthPart).padStart(2, '0')}-01`;
  const lastDay = new Date(year, monthPart, 0).getDate();
  const end = `${year}-${String(monthPart).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

export function getCurrentMonthKey(): MonthKey {
  return getMonthKey(new Date());
}

export function nowISOString(): string {
  return new Date().toISOString();
}
