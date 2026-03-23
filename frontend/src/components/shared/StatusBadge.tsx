import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'

interface StatusBadgeProps {
  status: 'ACTIVE' | 'IDLE' | 'ERROR' | 'PENDING' | 'SUCCESS' | 'IN_PROGRESS' | 'FAILED'
  label?: string
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const config = {
    ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle },
    IDLE: { bg: 'bg-gray-100', text: 'text-gray-700', Icon: Clock },
    ERROR: { bg: 'bg-red-100', text: 'text-red-700', Icon: XCircle },
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', Icon: Clock },
    SUCCESS: { bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle },
    IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', Icon: AlertCircle },
    FAILED: { bg: 'bg-red-100', text: 'text-red-700', Icon: XCircle },
  }

  const { bg, text, Icon } = config[status]
  const displayLabel = label || status

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', bg, text)}>
      <Icon className="h-3 w-3" />
      {displayLabel}
    </span>
  )
}
