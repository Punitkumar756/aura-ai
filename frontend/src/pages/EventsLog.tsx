import { useEventLog } from '@/api/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ErrorTypeIcon } from '@/components/shared/ErrorTypeIcon'
import { formatDistanceToNow } from 'date-fns'

export const EventsLog = () => {
  const { data: eventData, isLoading } = useEventLog()

  if (isLoading) {
    return <LoadingSpinner label="Loading events..." />
  }

  const events = eventData?.events || []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Events Log</h1>
        <p className="text-muted-foreground mt-1">View all pipeline failures and agent actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events ({eventData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Project</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Agent</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No events recorded
                    </td>
                  </tr>
                ) : (
                  events.map(event => (
                    <tr key={event.event_id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ErrorTypeIcon type={event.details.failure_type || event.event_type} size={4} />
                          <span className="text-foreground">{event.event_type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{event.project_name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{event.agent_name}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={event.status as any} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
