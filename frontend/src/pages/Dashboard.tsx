import { useAgentStatus, usePipelineFailures, useDashboardMetrics } from '@/api/hooks'
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard'
import { PipelineFailureList } from '@/components/dashboard/PipelineFailureList'
import { LatestDecisionCard } from '@/components/dashboard/LatestDecisionCard'
import { MetricsWidget } from '@/components/dashboard/MetricsWidget'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertCircle } from 'lucide-react'

export const Dashboard = () => {
  const { data: agents, isLoading: agentsLoading } = useAgentStatus()
  const { data: failures, isLoading: failuresLoading } = usePipelineFailures()
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()

  if (!agents || !failures || !metrics) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
        <MetricsWidget metrics={metrics} isLoading={metricsLoading} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Failures and Decision */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineFailureList failures={failures} isLoading={failuresLoading} />
          <LatestDecisionCard />
        </div>

        {/* Right Column - Agent Status */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
          <div className="space-y-3">
            {agentsLoading ? (
              <LoadingSpinner />
            ) : agents.length === 0 ? (
              <div className="flex items-center gap-2 text-amber-600 p-4 bg-amber-50 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">No agents available</p>
              </div>
            ) : (
              agents.map(agent => (
                <AgentStatusCard key={agent.agent_name} agent={agent} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
