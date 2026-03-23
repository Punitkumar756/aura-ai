import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AgentStatus } from '@/types'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface AgentStatusCardProps {
  agent: AgentStatus
}

export const AgentStatusCard = ({ agent }: AgentStatusCardProps) => {
  const lastActivityTime = new Date(agent.last_activity)
  const minutesAgo = Math.floor((Date.now() - lastActivityTime.getTime()) / 60000)
  const timeLabel = minutesAgo === 0 ? 'Just now' : `${minutesAgo}m ago`

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
          <StatusBadge status={agent.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Activity</span>
            <span className="text-foreground font-medium">{timeLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Successes</p>
              <p className="text-2xl font-bold text-green-600">{agent.successes}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-red-600">{agent.errors}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
