/**
 * Naming conventions for the Expense Mobile codebase.
 *
 * Screens:     PascalCase + "Screen" suffix  → HomeScreen.tsx
 * Components:  PascalCase                    → ScreenContainer.tsx
 * Hooks:       camelCase + "use" prefix      → useTransactions.ts
 * Services:    camelCase + descriptive noun  → transactionService.ts
 * Utils:       camelCase                     → formatCurrency.ts
 * Types:       PascalCase                    → Transaction, CategoryId
 * Folders:     PascalCase for screens/components, camelCase for utils/hooks/services
 * Constants:   SCREAMING_SNAKE_CASE          → APP_NAME, TAB_ROUTES
 */

export const NAMING = {
  screenSuffix: 'Screen',
  hookPrefix: 'use',
} as const;
