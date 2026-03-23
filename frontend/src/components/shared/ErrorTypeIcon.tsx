import { AlertTriangle, AlertCircle, FileQuestion, Settings, Package, Bug, Zap } from 'lucide-react'
import { IssueType } from '@/types'

interface ErrorTypeIconProps {
  type: IssueType | string
  size?: number
}

export const ErrorTypeIcon = ({ type, size = 5 }: ErrorTypeIconProps) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    [IssueType.LINT_ERROR]: AlertTriangle,
    [IssueType.TEST_FAILURE]: AlertCircle,
    [IssueType.IMPORT_ERROR]: FileQuestion,
    [IssueType.CONFIG_ERROR]: Settings,
    [IssueType.DEPENDENCY_ERROR]: Package,
    [IssueType.SYNTAX_ERROR]: Bug,
    [IssueType.UNKNOWN]: Zap,
  }

  const IconComponent = iconMap[type] || Zap
  const colors: Record<string, string> = {
    [IssueType.LINT_ERROR]: 'text-amber-600',
    [IssueType.TEST_FAILURE]: 'text-red-600',
    [IssueType.IMPORT_ERROR]: 'text-blue-600',
    [IssueType.CONFIG_ERROR]: 'text-purple-600',
    [IssueType.DEPENDENCY_ERROR]: 'text-orange-600',
    [IssueType.SYNTAX_ERROR]: 'text-red-600',
    [IssueType.UNKNOWN]: 'text-gray-600',
  }

  const color = colors[type] || 'text-gray-600'
  const sizeClass = `h-${size} w-${size}`

  return <IconComponent className={`${sizeClass} ${color}`} />
}
