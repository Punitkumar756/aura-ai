import { Card, CardContent } from '@/components/ui/Card'
import { DashboardMetrics } from '@/types'
import { Zap, TrendingUp, CheckCircle, Clock } from 'lucide-react'

interface MetricsWidgetProps {
  metrics: DashboardMetrics
  isLoading?: boolean
}

export const MetricsWidget = ({ metrics, isLoading }: MetricsWidgetProps) => {
  const metricCards = [
    {
      label: 'Failures Today',
      value: metrics.total_failures_today,
      icon: Zap,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'Avg Diagnosis Time',
      value: `${(metrics.avg_diagnosis_time_ms / 1000).toFixed(2)}s`,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Success Rate',
      value: `${metrics.success_rate_percent.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Active Agents',
      value: metrics.active_agents,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className={isLoading ? 'animate-pulse' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
