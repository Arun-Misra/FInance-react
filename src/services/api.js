import axios from 'axios'

const exchangeApi = axios.create({
  baseURL: 'https://api.frankfurter.app',
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

export async function fetchExchangeRate(baseCurrency = 'INR', targetCurrency = 'USD') {
  if (baseCurrency === targetCurrency) {
    return 1
  }

  try {
    const response = await exchangeApi.get('/latest', {
      params: {
        amount: 1,
        from: baseCurrency,
        to: targetCurrency,
      },
    })

    const rate = response?.data?.rates?.[targetCurrency]

    if (!rate) {
      throw new Error('Exchange rate is unavailable right now.')
    }

    return rate
  } catch {
    const fallbackRate = fallbackRates[baseCurrency]?.[targetCurrency]

    if (!fallbackRate) {
      throw new Error('Exchange rate is unavailable right now.')
    }

    return fallbackRate
  }
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
        q: query,
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
        ...(domains ? { domains } : {}),
        ...(excludeDomains ? { excludeDomains } : {}),
        language,
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
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) : '',
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
