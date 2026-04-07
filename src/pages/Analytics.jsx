import { useFinance } from '../context/FinanceContext'
import {
  IncomeExpenseBarChart,
  MonthlyTrendChart,
  SpendingPieChart,
} from '../components/Charts/FinanceCharts'
import { useCurrency } from '../hooks/useCurrency'

export default function Analytics() {
  const { spendingByCategory, monthlyTrend } = useFinance()
  const { formatInr } = useCurrency()

  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>Analytics</h1>
      </div>

      <div className="chart-grid analytics-grid">
        <SpendingPieChart data={spendingByCategory} />
        <MonthlyTrendChart data={monthlyTrend} />
      </div>

      <IncomeExpenseBarChart data={monthlyTrend} />

      <section className="card">
        <h3>Category Breakdown</h3>
        {spendingByCategory.length ? (
          <div className="breakdown-list">
            {spendingByCategory
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <p key={item.name}>
                  <span>{item.name}</span>
                  <strong>{formatInr(item.value)}</strong>
                </p>
              ))}
          </div>
        ) : (
          <p className="state-message">Add expense transactions to see analytics.</p>
        )}
      </section>
    </section>
  )
}
