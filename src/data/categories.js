export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Entertainment',
  'Health',
  'Utilities',
  'Subscriptions',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income',
]

export const ALL_CATEGORIES = [
  'All',
  ...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
]
