import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle } from 'lucide-react'

export const Settings = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure Aura AI behavior and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configuration options will be available in the next phase:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✓ Confidence threshold adjustment</li>
              <li>✓ Auto-fix toggle</li>
              <li>✓ Notification preferences</li>
              <li>✓ API key management</li>
              <li>✓ Agent enable/disable controls</li>
            </ul>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About Aura AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Version:</strong> 0.1.0
              </p>
              <p>
                <strong className="text-foreground">Status:</strong> MVP
              </p>
              <p>
                <strong className="text-foreground">API:</strong> http://localhost:8000
              </p>
              <p className="mt-4">
                Event-driven agent system for automated GitLab pipeline diagnosis and fixes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
