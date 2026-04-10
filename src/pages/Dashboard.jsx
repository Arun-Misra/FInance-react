import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFinance } from '../context/useFinance'
import { useCurrency } from '../hooks/useCurrency'
import { BudgetCard } from '../components/BudgetCard'
import { TransactionCard } from '../components/TransactionCard'
import { MonthlyTrendChart, SpendingPieChart } from '../components/Charts/FinanceCharts'
import { fetchFinancialNews } from '../services/api'

const DEFAULT_NEWS_QUERY = 'economy OR business OR markets'

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
  const [newsItems, setNewsItems] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsLoadingMore, setNewsLoadingMore] = useState(false)
  const [newsOpen, setNewsOpen] = useState(false)
  const [newsQuery, setNewsQuery] = useState('')
  const [newsPage, setNewsPage] = useState(1)
  const [newsTotalResults, setNewsTotalResults] = useState(0)

  const recentTransactions = transactions.slice(0, 4)
  const previewNews = newsItems.slice(0, 2)
  const activeNewsQuery = newsQuery.trim() || DEFAULT_NEWS_QUERY
  const hasMoreNews = newsItems.length < newsTotalResults || newsItems.length % 8 === 0

  const closeNewsModal = useCallback(() => {
    setNewsOpen(false)
    setNewsQuery('')
    setNewsPage(1)
  }, [])

  const loadNews = useCallback((query = DEFAULT_NEWS_QUERY, page = 1, append = false) => {
    if (append) {
      setNewsLoadingMore(true)
    } else {
      setNewsLoading(true)
    }

    fetchFinancialNews({ query, page, pageSize: 8, fallbackOnEmpty: !append })
      .then(({ articles, totalResults }) => {
        setNewsItems((prev) => (append ? [...prev, ...articles] : articles))
        setNewsTotalResults(totalResults)
      })
      .finally(() => {
        setNewsLoading(false)
        setNewsLoadingMore(false)
      })
  }, [])

  const openNewsModal = useCallback(() => {
    setNewsOpen(true)
    setNewsPage(1)
    setNewsQuery('')
    setNewsTotalResults(0)
    loadNews(DEFAULT_NEWS_QUERY, 1, false)
  }, [loadNews])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadNews(DEFAULT_NEWS_QUERY, 1, false)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadNews])

  useEffect(() => {
    if (!newsOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeNewsModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [newsOpen, closeNewsModal])

  const handleNewsSearch = (event) => {
    event.preventDefault()
    setNewsPage(1)
    setNewsTotalResults(0)
    loadNews(newsQuery.trim() || DEFAULT_NEWS_QUERY, 1, false)
  }

  const handleLoadMoreNews = () => {
    const nextPage = newsPage + 1
    setNewsPage(nextPage)
    loadNews(activeNewsQuery, nextPage, true)
  }

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

      <div className="dashboard-summary-grid">
        <div className="dashboard-summary-left">
          <div className="dashboard-stats-grid">
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
        </div>

        <section className="card news-card">
          <div className="section-title">
            <h2>Financial News</h2>
            <button type="button" className="text-link" onClick={openNewsModal}>
              See more
            </button>
          </div>

          {newsLoading ? (
            <p className="state-message">Loading financial news...</p>
          ) : previewNews.length ? (
            <div className="news-list">
              {previewNews.map((item) => (
                <article key={`${item.title}-${item.source}`} className="news-item">
                  <p className="news-source">{item.source}</p>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                  <small>{item.description}</small>
                </article>
              ))}
            </div>
          ) : (
            <p className="state-message">No news available right now.</p>
          )}
        </section>
      </div>

      {newsOpen ? (
        <div className="news-modal-backdrop" role="presentation" onClick={closeNewsModal}>
          <section
            className="news-modal card"
            role="dialog"
            aria-modal="true"
            aria-label="Financial news"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-title">
              <h2>Financial News</h2>
              <button type="button" className="text-link" onClick={closeNewsModal}>
                Close
              </button>
            </div>

            <p className="news-modal-note">
              Search for topics like economy, inflation, crypto, stocks, or RBI and scroll to read more.
            </p>

            <form className="news-search-bar" onSubmit={handleNewsSearch}>
              <input
                type="text"
                value={newsQuery}
                onChange={(event) => setNewsQuery(event.target.value)}
                placeholder='Search topics like economy, inflation, crypto, stocks, or RBI'
                aria-label="Search news topics"
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>

            {newsLoading ? (
              <p className="state-message">Loading financial news...</p>
            ) : newsItems.length ? (
              <div className="news-list news-list-scroll">
                {newsItems.map((item) => (
                  <article key={`${item.title}-${item.source}`} className="news-item">
                    <p className="news-source">{item.source}</p>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                    {item.publishedAt ? <small className="news-time">{item.publishedAt}</small> : null}
                    <small>{item.description}</small>
                  </article>
                ))}

                {hasMoreNews ? (
                  <button type="button" className="load-more-news" onClick={handleLoadMoreNews} disabled={newsLoadingMore}>
                    {newsLoadingMore ? 'Loading more news...' : 'Load more news'}
                  </button>
                ) : (
                  <p className="news-end">You've reached the latest headlines.</p>
                )}
              </div>
            ) : (
              <p className="state-message">No news available right now.</p>
            )}
          </section>
        </div>
      ) : null}

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
