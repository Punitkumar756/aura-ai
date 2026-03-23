import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const Analytics = () => {
  // Mock data for charts
  const failuresOverTime = [
    { time: '00:00', failures: 2 },
    { time: '04:00', failures: 3 },
    { time: '08:00', failures: 5 },
    { time: '12:00', failures: 4 },
    { time: '16:00', failures: 6 },
    { time: '20:00', failures: 4 },
    { time: '23:59', failures: 3 },
  ]

  const errorDistribution = [
    { name: 'Test Failure', value: 35 },
    { name: 'Lint Error', value: 25 },
    { name: 'Import Error', value: 20 },
    { name: 'Config Error', value: 15 },
    { name: 'Other', value: 5 },
  ]

  const mttrTrend = [
    { week: 'Week 1', mttr: 4200 },
    { week: 'Week 2', mttr: 3800 },
    { week: 'Week 3', mttr: 3200 },
    { week: 'Week 4', mttr: 2100 },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failures Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Failures Over Time (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={failuresOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="failures" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Error Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={errorDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {errorDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MTTR Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mean Time To Recovery (MTTR) Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mttrTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis label={{ value: 'MTTR (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}ms`} />
                <Legend />
                <Bar dataKey="mttr" fill="#10b981" name="MTTR (milliseconds)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
