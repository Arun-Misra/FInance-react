import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import { useDebounce } from '../hooks/useDebounce'
import { SearchBar } from '../components/SearchBar'
import { Filters } from '../components/Filters'
import { TransactionCard } from '../components/TransactionCard'

const initialFilters = {
  search: '',
  category: 'All',
  type: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date-desc',
}

export default function Transactions() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(initialFilters)
  const debouncedSearch = useDebounce(filters.search, 250)

  const { loading, filteredTransactions, deleteTransaction } = useTransactions({
    ...filters,
    search: debouncedSearch,
  })

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>Transactions</h1>
        <Link className="btn-primary" to="/transactions/new">
          Add Transaction
        </Link>
      </div>

      <SearchBar value={filters.search} onChange={(value) => updateFilter('search', value)} />
      <Filters filters={filters} onChange={updateFilter} onClear={clearFilters} />

      {loading ? (
        <p className="state-message">Loading transactions...</p>
      ) : filteredTransactions.length ? (
        <div className="list-stack">
          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={deleteTransaction}
              onEdit={(id) => navigate(`/transactions/new?id=${id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="state-message">No matching transactions found.</p>
      )}
    </section>
  )
}
