import { ALL_CATEGORIES } from '../data/categories'

export function Filters({ filters, onChange, onClear }) {
  return (
    <div className="filters-grid card">
      <label>
        Category
        <select
          value={filters.category}
          onChange={(event) => onChange('category', event.target.value)}
        >
          {ALL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Type
        <select value={filters.type} onChange={(event) => onChange('type', event.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>

      <label>
        From
        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => onChange('startDate', event.target.value)}
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={filters.endDate}
          onChange={(event) => onChange('endDate', event.target.value)}
        />
      </label>

      <label>
        Sort
        <select
          value={filters.sortBy}
          onChange={(event) => onChange('sortBy', event.target.value)}
        >
          <option value="date-desc">Date (Latest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-desc">Amount (High to Low)</option>
          <option value="amount-asc">Amount (Low to High)</option>
          <option value="category">Category</option>
        </select>
      </label>

      <button type="button" className="btn-secondary" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  )
}
