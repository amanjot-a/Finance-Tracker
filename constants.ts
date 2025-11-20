import { Category, TransactionType } from './types';

export const CATEGORY_COLORS: Record<string, string> = {
  [Category.FOOD]: '#f59e0b', // Amber
  [Category.TRANSPORT]: '#3b82f6', // Blue
  [Category.HOUSING]: '#6366f1', // Indigo
  [Category.UTILITIES]: '#06b6d4', // Cyan
  [Category.ENTERTAINMENT]: '#ec4899', // Pink
  [Category.SHOPPING]: '#8b5cf6', // Violet
  [Category.HEALTH]: '#10b981', // Emerald
  [Category.SALARY]: '#22c55e', // Green
  [Category.FREELANCE]: '#84cc16', // Lime
  [Category.INVESTMENT]: '#14b8a6', // Teal
  [Category.OTHER]: '#94a3b8', // Slate
};

export const DEFAULT_CATEGORIES = Object.values(Category);

export const TRANSACTION_TYPES = [
  { label: 'Income', value: TransactionType.INCOME },
  { label: 'Expense', value: TransactionType.EXPENSE },
];
