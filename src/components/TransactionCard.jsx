import { format } from 'date-fns'
import { FiEdit2, FiTrash2, FiRepeat } from 'react-icons/fi'
import { useCurrency } from '../hooks/useCurrency'

export function TransactionCard({ transaction, onEdit, onDelete }) {
  const { formatInr } = useCurrency()

  return (
    <article className={`transaction-card ${transaction.type} ${transaction.recurring ? 'recurring' : ''}`}>
      <div className="transaction-main">
        <h3>{transaction.title}</h3>
        <p>{transaction.category}</p>
      </div>

      <div className="transaction-meta">
        <strong>{formatInr(transaction.amount)}</strong>
        <span>{format(new Date(transaction.date), 'dd MMM yyyy')}</span>
      </div>

      <div className="transaction-tags">
        <span className={`pill ${transaction.type}`}>{transaction.type}</span>
        {transaction.recurring && (
          <span className="pill recurring-pill">
            <FiRepeat /> Recurring
          </span>
        )}
      </div>

      {transaction.notes ? <p className="transaction-notes">{transaction.notes}</p> : null}

      <div className="transaction-actions">
        <button type="button" onClick={() => onEdit(transaction.id)}>
          <FiEdit2 /> Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(transaction.id)}>
          <FiTrash2 /> Delete
        </button>
      </div>
    </article>
  )
}
