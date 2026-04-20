# FlowFunds - Personal Finance Tracker

A modern React finance app for tracking income and expenses, managing monthly budgets, visualizing spending trends, converting currencies, and reading finance-focused news.

FlowFunds is built as a single-page application with:

- Fast routing and lazy-loaded pages
- Local-first persistence using browser storage
- Transaction filtering, searching, and sorting
- Budget health indicators and analytics charts
- Currency conversion with multi-level API fallbacks
- Finance news with search and pagination

## Live Deployment

This project is configured for GitHub Pages deployment through the following settings:

- homepage in package.json: https://arun-misra.github.io/Finance-react  (apis not working for now in gh-pages, will update when resolved)
- Vite base path in vite.config.js: /Finance-react/

If you deploy under a different repository or path, update both values.

## Core Features

### 1) Dashboard Overview

- Summary cards for Total Income, Total Expenses, Net Balance, and Top Spending Category
- Budget overview card with percentage usage and over-budget indication
- Financial news preview section with quick access to full modal view
- Recent transactions list with inline Edit/Delete actions
- Embedded charts:
	- Spending by category (pie chart)
	- Monthly spending trend (line chart)

### 2) Transactions Management

- Add, edit, and delete transactions
- Supports two transaction types:
	- income
	- expense
- Category system for both income and expense flows
- Optional recurring flag for repeated expenses
- Notes field for context

### 3) Smart Validation for Transaction Form

Validation is powered by react-hook-form + Yup:

- Title: required, max length
- Amount: required, positive number
- Category: required
- Date: required
- Type: must be income or expense
- Notes: optional, max length

When switching type, category options automatically sync to relevant category sets.

### 4) Transaction Discovery Experience

- Search by title or notes
- Debounced search input for smoother filtering
- Category filter
- Type filter
- Date range filter (from and to)
- Sort options:
	- Date latest first
	- Date oldest first
	- Amount high to low
	- Amount low to high
	- Category alphabetical
- One-click clear filters

### 5) Budget Tracking

- Configure monthly budget (INR)
- Budget card calculates:
	- Monthly budget
	- Current month spending
	- Remaining budget
	- Percent used
	- Over-budget status
- Currency snapshot (INR -> USD) for quick international context

### 6) Currency Converter

- Convert between INR, USD, EUR, GBP, JPY, AUD, CAD, SGD
- Handles same-currency conversion instantly
- Uses live exchange rate API with graceful fallback behavior

### 7) Analytics

- Spending by category pie visualization
- Monthly trend line chart
- Income vs expense bar chart
- Sorted category breakdown with formatted values

### 8) Finance News Integration

- News source: NewsAPI
- Built-in finance context query enhancement
- Search inside finance topics (inflation, stocks, crypto, RBI, etc.)
- Modal experience for expanded reading
- Load more pagination
- Friendly fallback news if API key is missing or request fails

### 9) User Experience and UI Behaviors

- Theme toggle with persistence in localStorage
- Toast notifications for create/update/delete and budget actions
- Route-level lazy loading with suspense fallback
- Responsive card/grid layout patterns across pages

## Tech Stack

### Frontend

- React 19
- React Router DOM 7
- Vite 8

### Forms and Validation

- react-hook-form
- Yup
- @hookform/resolvers

### Data and Utilities

- Axios
- date-fns
- uuid

### Visuals

- Recharts
- react-icons
- react-toastify

### Quality and Tooling

- ESLint 9 flat config
- @vitejs/plugin-react
- gh-pages (deployment)

## Architecture Overview

The app follows a local-first architecture where global finance state is managed in context and persisted in browser storage.

### State Layer

- FinanceProvider stores and exposes:
	- transactions
	- budget
	- loading state
	- CRUD operations for transactions
	- budget update action
	- computed metrics (income, expenses, balance, top category, trends)

### Persistence

- Transactions and budget are saved in localStorage
- Data is restored on app start
- Storage keys:
	- finance.transactions
	- finance.budget

### Routing

Main routes:

- /dashboard
- /transactions
- /transactions/new
- /budget
- /currency-converter
- /analytics

Root route redirects to /dashboard.

## Project Structure

src/

- components/
	- BudgetCard.jsx
	- Filters.jsx
	- SearchBar.jsx
	- TransactionCard.jsx
	- Charts/FinanceCharts.jsx
- context/
	- FinanceContext.jsx
	- FinanceContextObject.js
	- useFinance.js
- data/
	- categories.js
- hooks/
	- useBudget.js
	- useCurrency.js
	- useDebounce.js
	- useTransactions.js
- pages/
	- Dashboard.jsx
	- Transactions.jsx
	- AddTransaction.jsx
	- Budget.jsx
	- CurrencyConverter.jsx
	- Analytics.jsx
- services/
	- api.js
- utils/
	- currencyFormatter.js

## External APIs and Fallback Strategy

### Exchange Rates

Primary source:

- Frankfurter API

Secondary source:

- exchangerate.host

Last resort:

- hardcoded fallback rates for key currencies

Development proxy endpoints are configured in Vite to avoid CORS issues.

### Financial News

Source:

- NewsAPI /everything endpoint

Behavior:

- If VITE_NEWS_API_KEY is missing, fallback finance tips are shown
- If API call fails, fallback articles are shown (when fallback is enabled)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended current LTS)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

npm install

3. Start development server:

npm run dev

4. Open the URL shown by Vite (usually http://localhost:5173)

## Environment Variables

Create a .env file in project root for optional news integration:

VITE_NEWS_API_KEY=your_newsapi_key

Notes:

- Without this key, app still works using fallback articles
- Never commit secrets to version control

## Available Scripts

- npm run dev
	- Starts local development server
- npm run build
	- Creates production build in dist/
- npm run preview
	- Previews production build locally
- npm run lint
	- Runs ESLint checks
- npm run predeploy
	- Builds app before deploy
- npm run deploy
	- Publishes dist/ to GitHub Pages using gh-pages

## Deployment Notes (GitHub Pages)

This project is already configured for GitHub Pages under /Finance-react/.

To deploy:

1. Ensure homepage in package.json matches your repo URL
2. Ensure base in vite.config.js matches your repo path
3. Run:

npm run deploy

If deploying to a different repository name, update both settings first.

## Data Model Snapshot

A transaction object typically includes:

- id: string (UUID)
- title: string
- amount: number
- category: string
- date: string (ISO-compatible)
- type: income | expense
- notes: string
- recurring: boolean

Budget object:

- monthlyBudget: number

## Performance and UX Considerations

- Route-level code splitting with React.lazy
- Debounced search to reduce unnecessary re-filtering
- useMemo usage for computed aggregates and filtered data
- Manual chunking in Vite build for better asset splitting

## Known Constraints

- No backend sync: data is per browser/device (localStorage only)
- No authentication or multi-user profiles
- Currency/news results depend on third-party API availability
- Fallback rates are static and not real-time when APIs are unavailable

## Roadmap Ideas

- CSV/PDF export for transactions and reports
- Multi-currency base wallet and per-account balances
- Recurring transaction scheduler and reminders
- Cloud sync (Supabase/Firebase/etc.)
- Authentication and profile-level separation
- Goal tracking and savings milestones
- PWA offline enhancements

## Troubleshooting

### News not loading

- Check VITE_NEWS_API_KEY in .env
- Validate NewsAPI quota and key status
- App will still show fallback content by design

### Currency conversion unavailable

- Verify internet access and API reachability
- Check browser console for API errors
- App falls back to static rates for supported pairs

### Empty charts

- Add expense and income transactions first
- Ensure transaction dates are valid

## Contributing

Contributions are welcome.

Suggested process:

1. Create a feature branch
2. Make focused changes
3. Run lint and build checks
4. Open a pull request with clear context and screenshots if UI changes are included

## License

No license file is currently included. Add a LICENSE file if you want to define open-source usage terms.
