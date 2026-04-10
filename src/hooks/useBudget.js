import { useMemo } from 'react'
import { useFinance } from '../context/useFinance'

export function useBudget() {
  const { budget, transactions } = useFinance()

  return useMemo(() => {
    const monthlyBudget = Number(budget.monthlyBudget) || 0
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const spent = transactions
      .filter((item) => item.type === 'expense')
      .filter((item) => {
        const date = new Date(item.date)
        if (Number.isNaN(date.getTime())) return false
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

    const remaining = monthlyBudget - spent
    const percentageUsed = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0

    return {
      monthlyBudget,
      spent,
      remaining,
      percentageUsed,
      isOverBudget: remaining < 0,
    }
  }, [budget.monthlyBudget, transactions])
}
