import { useEffect, useState } from 'react'
import { BudgetCard } from '../components/BudgetCard'
import { useBudget } from '../hooks/useBudget'
import { useCurrency } from '../hooks/useCurrency'
import { useFinance } from '../context/FinanceContext'
import { fetchExchangeRate } from '../services/api'

export default function Budget() {
  const { setMonthlyBudget } = useFinance()
  const { monthlyBudget, spent } = useBudget()
  const { formatInr, formatDynamic } = useCurrency()

  const [budgetInput, setBudgetInput] = useState(monthlyBudget)
  const [usdRate, setUsdRate] = useState(null)
  const [usdError, setUsdError] = useState('')

  useEffect(() => {
    setBudgetInput(monthlyBudget)
  }, [monthlyBudget])

  useEffect(() => {
    let isMounted = true

    fetchExchangeRate('INR', 'USD')
      .then((rate) => {
        if (isMounted) {
          setUsdRate(rate)
          setUsdError('')
        }
      })
      .catch(() => {
        if (isMounted) {
          setUsdError('Could not load currency conversion right now.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const onSave = (event) => {
    event.preventDefault()
    setMonthlyBudget(budgetInput)
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>Budget Tracking</h1>
      </div>

      <form className="card budget-form" onSubmit={onSave}>
        <label>
          Monthly Budget (INR)
          <input
            type="number"
            min="0"
            step="0.01"
            value={budgetInput}
            onChange={(event) => setBudgetInput(event.target.value)}
          />
        </label>
        <button className="btn-primary" type="submit">
          Save Budget
        </button>
      </form>

      <BudgetCard />

      <section className="card currency-panel">
        <h3>Currency Snapshot (INR to USD)</h3>
        {usdRate ? (
          <div className="currency-grid">
            <p>
              <span>Budget in USD</span>
              <strong>{formatDynamic(monthlyBudget * usdRate, 'USD', 'en-US')}</strong>
            </p>
            <p>
              <span>Spent in USD</span>
              <strong>{formatDynamic(spent * usdRate, 'USD', 'en-US')}</strong>
            </p>
            <p>
              <span>Current Rate</span>
              <strong>1 INR = {usdRate.toFixed(4)} USD</strong>
            </p>
          </div>
        ) : usdError ? (
          <p className="state-message">{usdError}</p>
        ) : (
          <p className="state-message">Loading exchange rate...</p>
        )}

        <small>Base values: {formatInr(monthlyBudget)} budget, {formatInr(spent)} spent.</small>
      </section>
    </section>
  )
}
