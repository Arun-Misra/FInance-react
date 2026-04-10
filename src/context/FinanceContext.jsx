import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { format, parseISO } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { FinanceContext } from './FinanceContextObject'

const TRANSACTIONS_STORAGE_KEY = 'finance.transactions'
const BUDGET_STORAGE_KEY = 'finance.budget'

function parseDateValue(value) {
  try {
    if (!value) return null
    return typeof value === 'string' ? parseISO(value) : new Date(value)
  } catch {
    return null
  }
}

function toMonthLabel(value) {
  const parsed = parseDateValue(value)
  return parsed ? format(parsed, 'MMM yy') : 'Unknown'
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [budget, setBudget] = useState({ monthlyBudget: 50000 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
    const savedBudget = localStorage.getItem(BUDGET_STORAGE_KEY)

    const timer = setTimeout(() => {
      if (savedTransactions) {
        try {
          setTransactions(JSON.parse(savedTransactions))
        } catch {
          setTransactions([])
        }
      }

      if (savedBudget) {
        try {
          setBudget(JSON.parse(savedBudget))
        } catch {
          setBudget({ monthlyBudget: 50000 })
        }
      }

      setLoading(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
    }
  }, [transactions, loading])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budget))
    }
  }, [budget, loading])

  const addTransaction = useCallback((transaction) => {
    const payload = {
      ...transaction,
      id: uuidv4(),
      amount: Number(transaction.amount),
    }

    setTransactions((prev) => [payload, ...prev])
    toast.success('Transaction added')
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
    toast.info('Transaction deleted')
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              amount: Number(updates.amount),
            }
          : item,
      ),
    )
    toast.success('Transaction updated')
  }, [])

  const setMonthlyBudget = useCallback((monthlyBudget) => {
    setBudget({ monthlyBudget: Number(monthlyBudget) || 0 })
    toast.success('Monthly budget saved')
  }, [])

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0),
    [transactions],
  )

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0),
    [transactions],
  )

  const netBalance = totalIncome - totalExpenses

  const spendingByCategory = useMemo(() => {
    const categoryMap = transactions
      .filter((item) => item.type === 'expense')
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount)
        return acc
      }, {})

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const topSpendingCategory = useMemo(() => {
    if (!spendingByCategory.length) return 'N/A'

    return [...spendingByCategory].sort((a, b) => b.value - a.value)[0].name
  }, [spendingByCategory])

  const monthlyTrend = useMemo(() => {
    const map = transactions.reduce((acc, item) => {
      const month = toMonthLabel(item.date)

      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 }
      }

      acc[month][item.type] += Number(item.amount)
      return acc
    }, {})

    return Object.values(map)
  }, [transactions])

  const value = useMemo(
    () => ({
      transactions,
      budget,
      loading,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      setMonthlyBudget,
      totalIncome,
      totalExpenses,
      netBalance,
      topSpendingCategory,
      spendingByCategory,
      monthlyTrend,
    }),
    [
      transactions,
      budget,
      loading,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      setMonthlyBudget,
      totalIncome,
      totalExpenses,
      netBalance,
      topSpendingCategory,
      spendingByCategory,
      monthlyTrend,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
