import { compareDesc, isAfter, isBefore, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { useFinance } from '../context/useFinance'

function parseDateSafe(value) {
  try {
    return parseISO(value)
  } catch {
    return new Date(0)
  }
}

export function useTransactions(filters) {
  const finance = useFinance()
  const { transactions } = finance

  const filteredTransactions = useMemo(() => {
    const {
      search = '',
      category = 'All',
      type = 'all',
      startDate = '',
      endDate = '',
      sortBy = 'date-desc',
    } = filters ?? {}

    let result = [...transactions]

    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.notes || '').toLowerCase().includes(query),
      )
    }

    if (category !== 'All') {
      result = result.filter((item) => item.category === category)
    }

    if (type !== 'all') {
      result = result.filter((item) => item.type === type)
    }

    if (startDate) {
      const start = parseDateSafe(startDate)
      result = result.filter((item) => !isBefore(parseDateSafe(item.date), start))
    }

    if (endDate) {
      const end = parseDateSafe(endDate)
      result = result.filter((item) => !isAfter(parseDateSafe(item.date), end))
    }

    result.sort((a, b) => {
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount)
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      if (sortBy === 'date-asc') {
        return parseDateSafe(a.date) - parseDateSafe(b.date)
      }

      return compareDesc(parseDateSafe(a.date), parseDateSafe(b.date))
    })

    return result
  }, [filters, transactions])

  return {
    ...finance,
    filteredTransactions,
  }
}
