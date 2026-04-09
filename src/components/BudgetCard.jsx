import { useBudget } from '../hooks/useBudget'
import { useCurrency } from '../hooks/useCurrency'

export function BudgetCard() {
  const { formatInr } = useCurrency()
  const { monthlyBudget, spent, remaining, percentageUsed, isOverBudget } = useBudget()

  const normalizedPercentage = Math.min(100, Math.max(0, percentageUsed))

  return (
    <section className="budget-card card">
      <header>
        <h3>Budget Overview</h3>
        <span className={isOverBudget ? 'status danger' : 'status'}>
          {isOverBudget ? 'Over Budget' : 'On Track'}
        </span>
      </header>

      <div className="budget-grid">
        <p>
          <span>Monthly Budget</span>
          <strong>{formatInr(monthlyBudget)}</strong>
        </p>
        <p>
          <span>Total Spending</span>
          <strong>{formatInr(spent)}</strong>
        </p>
        <p>
          <span>Remaining</span>
          <strong className={isOverBudget ? 'text-danger' : ''}>{formatInr(remaining)}</strong>
        </p>
      </div>

      <div className="progress-track" aria-label="Budget usage">
        <div className={`progress-fill ${isOverBudget ? 'danger' : ''}`} style={{ width: `${normalizedPercentage}%` }} />
      </div>
      <small>{percentageUsed.toFixed(1)}% of budget used</small>
    </section>
  )
}
