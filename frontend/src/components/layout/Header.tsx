import { useHealthCheck } from '@/api/hooks'
import { Activity, AlertCircle, CheckCircle } from 'lucide-react'

export const Header = () => {
  const { data: healthData, isLoading } = useHealthCheck()

  const getStatusIndicator = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-amber-600">
          <div className="h-2 w-2 bg-amber-600 rounded-full animate-pulse" />
          <span className="text-sm">Connecting...</span>
        </div>
      )
    }

    if (healthData?.status === 'ok') {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Backend Connected</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Offline</span>
      </div>
    )
  }

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aura AI</h1>
            <p className="text-sm text-muted-foreground">Agent Monitoring Dashboard</p>
          </div>
        </div>
        <div>{getStatusIndicator()}</div>
      </div>
    </header>
  )
}
