import { useCallback } from 'react'
import { formatCurrency } from '../utils/currencyFormatter'

export function useCurrency() {
  const formatInr = useCallback((value) => formatCurrency(value, 'INR', 'en-IN'), [])

  const formatDynamic = useCallback(
    (value, currency = 'INR', locale = 'en-IN') => formatCurrency(value, currency, locale),
    [],
  )

  return {
    formatInr,
    formatDynamic,
  }
}
