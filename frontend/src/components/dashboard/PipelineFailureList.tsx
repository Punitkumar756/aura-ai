import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EventLog, IssueType } from '@/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ErrorTypeIcon } from '@/components/shared/ErrorTypeIcon'
import { formatDistanceToNow } from 'date-fns'

interface PipelineFailureListProps {
  failures: EventLog[]
  isLoading?: boolean
}

export const PipelineFailureList = ({ failures, isLoading }: PipelineFailureListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Pipeline Failures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Pipeline Failures</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {failures.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No failures detected</p>
          ) : (
            failures.map(failure => (
              <div key={failure.event_id} className="flex items-start justify-between border-b border-border pb-3 last:border-b-0">
                <div className="flex gap-4 flex-1">
                  <div className="flex-shrink-0 pt-1">
                    <ErrorTypeIcon type={failure.details.failure_type || IssueType.UNKNOWN} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{failure.project_name}</p>
                    <p className="text-sm text-muted-foreground">{failure.details.diagnosis}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(failure.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={failure.action_status as any} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
