export function formatCurrency(value, currency = 'INR', locale = 'en-IN') {
  const amount = Number(value) || 0
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}
