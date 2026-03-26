import axios from 'axios'

const exchangeApi = axios.create({
  baseURL: 'https://api.exchangerate-api.com/v4/latest',
  timeout: 8000,
})

export async function fetchExchangeRate(baseCurrency = 'INR', targetCurrency = 'USD') {
  const response = await exchangeApi.get(`/${baseCurrency}`)
  const rate = response?.data?.rates?.[targetCurrency]

  if (!rate) {
    throw new Error('Exchange rate is unavailable right now.')
  }

  return rate
}
