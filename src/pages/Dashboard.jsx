import { Link, useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { useCurrency } from '../hooks/useCurrency'
import { BudgetCard } from '../components/BudgetCard'
import { TransactionCard } from '../components/TransactionCard'
import { MonthlyTrendChart, SpendingPieChart } from '../components/Charts/FinanceCharts'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    loading,
    totalIncome,
    totalExpenses,
    netBalance,
    topSpendingCategory,
    spendingByCategory,
    monthlyTrend,
    transactions,
    deleteTransaction,
  } = useFinance()
  const { formatInr } = useCurrency()

  const recentTransactions = transactions.slice(0, 4)

  if (loading) {
    return <p className="state-message">Loading your dashboard...</p>
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link className="btn-primary" to="/transactions/new">
          Add Transaction
        </Link>
      </div>

      <div className="stats-grid">
        <article className="stat-card card">
          <p>Total Income</p>
          <strong>{formatInr(totalIncome)}</strong>
        </article>
        <article className="stat-card card">
          <p>Total Expenses</p>
          <strong>{formatInr(totalExpenses)}</strong>
        </article>
        <article className="stat-card card">
          <p>Net Balance</p>
          <strong className={netBalance < 0 ? 'text-danger' : ''}>{formatInr(netBalance)}</strong>
        </article>
        <article className="stat-card card">
          <p>Top Category</p>
          <strong>{topSpendingCategory}</strong>
        </article>
      </div>

      <BudgetCard />

      <div className="chart-grid">
        <SpendingPieChart data={spendingByCategory} />
        <MonthlyTrendChart data={monthlyTrend} />
      </div>

      <section className="card">
        <div className="section-title">
          <h2>Recent Transactions</h2>
          <Link to="/transactions">View all</Link>
        </div>

        {recentTransactions.length ? (
          <div className="list-stack">
            {recentTransactions.map((item) => (
              <TransactionCard
                key={item.id}
                transaction={item}
                onDelete={deleteTransaction}
                onEdit={(id) => navigate(`/transactions/new?id=${id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="state-message">No transactions yet. Start by adding one.</p>
        )}
      </section>
    </section>
  )
}
