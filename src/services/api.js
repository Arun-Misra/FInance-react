import axios from 'axios'

// Use proxied endpoints in development to avoid CORS issues.
const EXCHANGE_BASE = import.meta.env.DEV ? '/api/exchange' : 'https://api.frankfurter.app'

const exchangeApi = axios.create({
  baseURL: EXCHANGE_BASE,
  timeout: 8000,
})

const newsApi = axios.create({
  baseURL: 'https://newsapi.org/v2',
  timeout: 8000,
})

const fallbackNews = [
  {
    title: 'Track recurring spending before it grows',
    source: 'FlowFunds',
    description: 'Subscriptions and fixed bills are often the easiest expenses to forget.',
    url: 'https://newsapi.org',
    publishedAt: 'Today',
  },
  {
    title: 'Budget reviews help spot overspending early',
    source: 'FlowFunds',
    description: 'A weekly check-in is usually enough to keep monthly spending on track.',
    url: 'https://newsapi.org',
    publishedAt: 'Today',
  },
  {
    title: 'Small savings add up over time',
    source: 'FlowFunds',
    description: 'Cutting one category by a small amount can free up meaningful cash flow.',
    url: 'https://newsapi.org',
    publishedAt: 'Today',
  },
]

const fallbackRates = {
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8, AUD: 0.018, CAD: 0.016, SGD: 0.016 },
  USD: { INR: 83.2, EUR: 0.92, GBP: 0.79, JPY: 149.0, AUD: 1.52, CAD: 1.36, SGD: 1.34 },
  EUR: { INR: 90.5, USD: 1.09, GBP: 0.86, JPY: 161.5, AUD: 1.65, CAD: 1.48, SGD: 1.46 },
  GBP: { INR: 105.0, USD: 1.27, EUR: 1.16, JPY: 188.0, AUD: 1.92, CAD: 1.72, SGD: 1.70 },
}

const FINANCE_CONTEXT_QUERY = '(finance OR financial OR economics OR economy OR business OR stock OR market OR investing OR inflation OR banking OR RBI)'

function buildFinancialNewsQuery(query) {
  const trimmed = (query || '').trim()

  if (!trimmed) {
    return FINANCE_CONTEXT_QUERY
  }

  return `(${trimmed}) AND ${FINANCE_CONTEXT_QUERY}`
}

function formatNewsPublishedAt(value, locale = 'en-IN') {
  if (!value) return ''

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const now = new Date()
  const articleLocal = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayDiff = Math.round((todayLocal - articleLocal) / (1000 * 60 * 60 * 24))

  if (dayDiff === 0) return 'Today'
  if (dayDiff === 1) return 'Yesterday'

  return parsedDate.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function fetchExchangeRate(baseCurrency = 'INR', targetCurrency = 'USD') {
  if (baseCurrency === targetCurrency) {
    return 1
  }
  // Try primary API (Frankfurter)
  try {
    const response = await exchangeApi.get('/latest', {
      params: {
        amount: 1,
        from: baseCurrency,
        to: targetCurrency,
      },
    })

    const rate = response?.data?.rates?.[targetCurrency]

    if (rate != null) {
      return rate
    }

    // If primary API returned but without the expected rate, try secondary source
    console.warn('fetchExchangeRate: primary API did not return rate, trying secondary API')
  } catch (err) {
    console.warn('fetchExchangeRate: primary API request failed', err && err.message ? err.message : err)
  }

  // Try secondary API (exchangerate.host) before falling back to hardcoded rates
  try {
    const secondaryUrl = import.meta.env.DEV ? '/api/exchange2/latest' : 'https://api.exchangerate.host/latest'

    const resp = await axios.get(secondaryUrl, {
      params: {
        base: baseCurrency,
        symbols: targetCurrency,
      },
      timeout: 8000,
    })

    const rate2 = resp?.data?.rates?.[targetCurrency]

    if (rate2 != null) {
      console.info('fetchExchangeRate: used exchangerate.host as secondary source')
      return rate2
    }

    console.warn('fetchExchangeRate: exchangerate.host did not return rate')
  } catch (err) {
    console.warn('fetchExchangeRate: secondary API request failed', err && err.message ? err.message : err)
  }

  // Last-resort static fallback
  const fallbackRate = fallbackRates[baseCurrency]?.[targetCurrency]

  if (!fallbackRate) {
    throw new Error('Exchange rate is unavailable right now.')
  }

  console.warn('fetchExchangeRate: using hardcoded fallback rate')
  return fallbackRate
}

export async function fetchFinancialNews(options = {}) {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY
  const {
    query = 'economy OR business OR markets',
    from,
    to,
    domains,
    excludeDomains,
    language = 'en',
    pageSize = 8,
    page = 1,
    fallbackOnEmpty = true,
  } = options
  const financeQuery = buildFinancialNewsQuery(query)

  if (!apiKey) {
    return fallbackOnEmpty
      ? {
          articles: fallbackNews,
          totalResults: fallbackNews.length,
        }
      : {
          articles: [],
          totalResults: 0,
        }
  }

  try {
    const response = await newsApi.get('/everything', {
      params: {
        q: financeQuery,
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
        ...(domains ? { domains } : {}),
        ...(excludeDomains ? { excludeDomains } : {}),
        language,
        searchIn: 'title,description',
        sortBy: 'publishedAt',
        pageSize,
        page,
        apiKey,
      },
    })

    const articles = response?.data?.articles ?? []
    const totalResults = response?.data?.totalResults ?? articles.length

    if (!articles.length) {
      return fallbackOnEmpty
        ? {
            articles: fallbackNews,
            totalResults: fallbackNews.length,
          }
        : {
            articles: [],
            totalResults,
          }
    }

    return {
      articles: articles.map((article) => ({
        title: article.title,
        source: article.source?.name || 'NewsAPI',
        description: article.description || article.content || 'No summary available.',
        url: article.url,
        publishedAt: formatNewsPublishedAt(article.publishedAt, 'en-IN'),
      })),
      totalResults,
    }
  } catch {
    return fallbackOnEmpty
      ? {
          articles: fallbackNews,
          totalResults: fallbackNews.length,
        }
      : {
          articles: [],
          totalResults: 0,
        }
  }
}
