import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const PIE_COLORS = ['#0f766e', '#ca8a04', '#b91c1c', '#0ea5e9', '#9333ea', '#4d7c0f', '#f97316']

function EmptyChartState() {
  return <div className="empty-chart">Not enough data yet</div>
}

export function SpendingPieChart({ data }) {
  return (
    <section className="chart-card card">
      <h3>Spending by Category</h3>
      {data.length ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
              {data.map((item, index) => (
                <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState />
      )}
    </section>
  )
}

export function MonthlyTrendChart({ data }) {
  return (
    <section className="chart-card card">
      <h3>Monthly Spending Trend</h3>
      {data.length ? (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="expense" stroke="#b91c1c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState />
      )}
    </section>
  )
}

export function IncomeExpenseBarChart({ data }) {
  return (
    <section className="chart-card card">
      <h3>Income vs Expense</h3>
      {data.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#15803d" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#b91c1c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState />
      )}
    </section>
  )
}
