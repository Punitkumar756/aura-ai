import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ConfidenceScore } from '@/components/shared/ConfidenceScore'
import { Zap } from 'lucide-react'

export const LatestDecisionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Latest Agent Decision</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">Pipeline Guardian → Acting</p>
              <p className="text-sm text-muted-foreground">pipeline_failure event detected</p>
              <p className="text-xs text-muted-foreground mt-1">Creating MR #47</p>
            </div>
          </div>
          <ConfidenceScore score={87} label="Decision Confidence" />
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            <p>Fix: import ('requests' to requirements.txt)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
