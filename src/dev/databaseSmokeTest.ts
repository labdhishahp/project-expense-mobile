import { categoryService, transactionService } from '../services';
import { TransactionType } from '../models';
import { formatCurrency } from '../utils/currency';
import { getCurrentMonthKey, toISODateString } from '../utils/date';

const LOG_PREFIX = '[DatabaseSmokeTest]';

/** Set to `true` locally to run the CRUD smoke test on app startup (dev only). */
export const ENABLE_DATABASE_SMOKE_TEST = false;

export async function runDatabaseSmokeTest(): Promise<void> {
  if (!__DEV__) {
    return;
  }

  console.log(`${LOG_PREFIX} Starting CRUD smoke test...`);

  const categories = await categoryService.getAll();
  console.log(`${LOG_PREFIX} Loaded categories:`, categories.length);

  const foodCategory =
    categories.find((category) => category.name === 'Food') ?? categories[0];

  if (!foodCategory) {
    throw new Error('No categories available for smoke test.');
  }

  const incomeCategory =
    categories.find((category) => category.name === 'Income') ?? categories[0];

  const today = toISODateString(new Date());

  const expense = await transactionService.create({
    type: TransactionType.EXPENSE,
    amount: 250.5,
    categoryId: foodCategory.id,
    description: 'Dev test lunch',
    date: today,
  });

  const income = await transactionService.create({
    type: TransactionType.INCOME,
    amount: 50000,
    categoryId: incomeCategory.id,
    description: 'Dev test salary',
    date: today,
  });

  console.log(`${LOG_PREFIX} Created transactions:`, {
    expense: expense.id,
    income: income.id,
  });

  const allTransactions = await transactionService.getAll();
  console.log(`${LOG_PREFIX} Total transactions:`, allTransactions.length);

  const monthTransactions = await transactionService.getByMonth(getCurrentMonthKey());
  console.log(`${LOG_PREFIX} Current month transactions:`, monthTransactions.length);

  const recent = await transactionService.getRecent(5);
  console.log(`${LOG_PREFIX} Recent transactions:`, recent.map((item) => item.description));

  const updatedExpense = await transactionService.update({
    id: expense.id,
    description: 'Dev test lunch (updated)',
    amount: 300,
  });

  console.log(`${LOG_PREFIX} Updated expense amount:`, formatCurrency(updatedExpense.amount));

  await transactionService.delete(expense.id);
  await transactionService.delete(income.id);

  const afterDelete = await transactionService.getAll();
  console.log(`${LOG_PREFIX} Transactions after cleanup:`, afterDelete.length);
  console.log(`${LOG_PREFIX} CRUD smoke test completed successfully.`);
}
