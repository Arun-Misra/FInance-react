import { lazy, Suspense, useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { FiActivity, FiBarChart2, FiCreditCard, FiDollarSign, FiRepeat } from 'react-icons/fi'
import { ToastContainer } from 'react-toastify'
import './App.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const AddTransaction = lazy(() => import('./pages/AddTransaction'))
const Budget = lazy(() => import('./pages/Budget'))
const Analytics = lazy(() => import('./pages/Analytics'))
const CurrencyConverter = lazy(() => import('./pages/CurrencyConverter'))

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiActivity },
  { to: '/transactions', label: 'Transactions', icon: FiCreditCard },
  { to: '/budget', label: 'Budget', icon: FiDollarSign },
  { to: '/currency-converter', label: 'Converter', icon: FiRepeat },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
]

const THEME_STORAGE_KEY = 'flowfunds.theme'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'qq1')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'qq1' ? 'qq2' : 'qq1'))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div>
            <h2>FlowFunds</h2>
            <p>Personal finance and expense analytics</p>
          </div>

          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'qq1' ? 'Switch to Neu' : 'Switch to Normal'}
          </button>
        </div>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                <Icon />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <main className="content">
        <Suspense fallback={<p className="state-message">Loading page...</p>}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<AddTransaction />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Suspense>
      </main>

      <ToastContainer position="top-right" autoClose={2200} />
    </div>
  )
}

export default App
