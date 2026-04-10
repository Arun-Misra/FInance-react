import { useEffect, useMemo, useState } from 'react'
import { fetchExchangeRate } from '../services/api'
import { useCurrency } from '../hooks/useCurrency'

const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD']

export default function CurrencyConverter() {
  const { formatDynamic } = useCurrency()
  const [amount, setAmount] = useState('1000')
  const [baseCurrency, setBaseCurrency] = useState('INR')
  const [targetCurrency, setTargetCurrency] = useState('USD')
  const [rate, setRate] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    if (baseCurrency === targetCurrency) {
      setRate(1)
      setError('')
      return () => {
        isMounted = false
      }
    }

    setRate(null)
    fetchExchangeRate(baseCurrency, targetCurrency)
      .then((nextRate) => {
        if (isMounted) {
          setRate(nextRate)
          setError('')
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Could not load conversion rate for selected currencies.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [baseCurrency, targetCurrency])

  const amountNumber = Number(amount) || 0
  const convertedAmount = useMemo(() => (rate ? amountNumber * rate : 0), [amountNumber, rate])

  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>Currency Converter</h1>
      </div>

      <section className="card currency-panel">
        <h3>Choose Conversion</h3>
        <div className="converter-grid">
          <label>
            Amount
            <input type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>

          <label>
            From
            <select value={baseCurrency} onChange={(event) => setBaseCurrency(event.target.value)}>
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>

          <label>
            To
            <select value={targetCurrency} onChange={(event) => setTargetCurrency(event.target.value)}>
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="state-message">{error}</p>
        ) : rate ? (
          <div className="currency-grid">
            <p>
              <span>{baseCurrency} Amount</span>
              <strong>{formatDynamic(amountNumber, baseCurrency)}</strong>
            </p>
            <p>
              <span>{targetCurrency} Value</span>
              <strong>{formatDynamic(convertedAmount, targetCurrency, 'en-US')}</strong>
            </p>
            <p>
              <span>Rate</span>
              <strong>
                1 {baseCurrency} = {rate.toFixed(4)} {targetCurrency}
              </strong>
            </p>
          </div>
        ) : (
          <p className="state-message">Loading conversion rate...</p>
        )}
      </section>
    </section>
  )
}