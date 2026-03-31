import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'

export function useBudget() {
  const { budget, totalExpenses } = useFinance()

  return useMemo(() => {
    const monthlyBudget = Number(budget.monthlyBudget) || 0
    const spent = Number(totalExpenses) || 0
    const remaining = monthlyBudget - spent
    const percentageUsed = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0

    return {
      monthlyBudget,
      spent,
      remaining,
      percentageUsed,
      isOverBudget: remaining < 0,
    }
  }, [budget.monthlyBudget, totalExpenses])
}
