import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories'
import { useFinance } from '../context/useFinance'

const schema = yup.object({
  title: yup.string().required('Title is required').max(60, 'Title is too long'),
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  date: yup.string().required('Date is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  notes: yup.string().max(240, 'Keep notes short'),
  recurring: yup.boolean(),
})

const defaultValues = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  notes: '',
  recurring: false,
}

export default function AddTransaction() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const { transactions, addTransaction, updateTransaction } = useFinance()

  const editingTransaction = useMemo(
    () => transactions.find((item) => item.id === editId),
    [transactions, editId],
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const currentType = useWatch({ control, name: 'type' })
  const selectedCategory = useWatch({ control, name: 'category' })

  useEffect(() => {
    if (editingTransaction) {
      reset({
        ...editingTransaction,
        date: editingTransaction.date?.slice(0, 10),
      })
    }
  }, [editingTransaction, reset])

  const categories = currentType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setValue('category', categories[0])
    }
  }, [categories, selectedCategory, setValue])

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      amount: Number(values.amount),
      recurring: Boolean(values.recurring),
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload)
    } else {
      addTransaction(payload)
    }

    navigate('/transactions')
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h1>
      </div>

      <form className="card form-grid" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Title
          <input type="text" {...register('title')} />
          {errors.title ? <small className="form-error">{errors.title.message}</small> : null}
        </label>

        <label>
          Amount
          <input type="number" step="0.01" {...register('amount')} />
          {errors.amount ? <small className="form-error">{errors.amount.message}</small> : null}
        </label>

        <label>
          Type
          <select {...register('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          Category
          <select {...register('category')}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? <small className="form-error">{errors.category.message}</small> : null}
        </label>

        <label>
          Date
          <input type="date" {...register('date')} />
          {errors.date ? <small className="form-error">{errors.date.message}</small> : null}
        </label>

        <label className="full-width">
          Notes
          <textarea rows={4} {...register('notes')} />
          {errors.notes ? <small className="form-error">{errors.notes.message}</small> : null}
        </label>

        <label className="checkbox-label full-width">
          <input type="checkbox" {...register('recurring')} />
          Mark as recurring expense (rent, subscriptions, gym)
        </label>

        <div className="form-actions full-width">
          <button type="button" className="btn-secondary" onClick={() => navigate('/transactions')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </section>
  )
}
