// Based on backend src/models.py

export enum EventType {
  PIPELINE_FAILED = 'PIPELINE_FAILED',
  MR_OPENED = 'MR_OPENED',
  SECURITY_SCAN_COMPLETE = 'SECURITY_SCAN_COMPLETE',
  DEPLOYMENT_FAILED = 'DEPLOYMENT_FAILED'
}

export enum IssueType {
  LINT_ERROR = 'LINT_ERROR',
  TEST_FAILURE = 'TEST_FAILURE',
  IMPORT_ERROR = 'IMPORT_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  SYNTAX_ERROR = 'SYNTAX_ERROR',
  UNKNOWN = 'UNKNOWN'
}

export interface PipelineFailedEvent {
  event_id: string
  event_type: EventType
  project_name: string
  pipeline_id: string
  failed_job: string
  branch: string
  commit_sha: string
  timestamp: string
}

export interface AgentDecision {
  event_id: string
  agent_name: string
  confidence: number
  should_act: boolean
  reason: string
}

export interface DiagnosisResult {
  issue_type: IssueType
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  root_cause: string
  fix_suggestion: string
  confidence: number
}

export interface AgentAction {
  action_id: string
  agent_name: string
  action_type: 'CREATE_BRANCH' | 'CREATE_MR' | 'UPDATE_STATUS' | 'ADD_COMMENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED'
  details: Record<string, any>
  timestamp: string
}

export interface EventLog {
  event_id: string
  event_type: EventType
  project_name: string
  status: string
  timestamp: string
  agent_name: string
  action_status: string
  details: Record<string, any>
}

export interface AgentStatus {
  agent_name: string
  status: 'ACTIVE' | 'IDLE' | 'ERROR'
  last_activity: string
  errors: number
  successes: number
}

export interface DashboardMetrics {
  total_failures_today: number
  avg_diagnosis_time_ms: number
  success_rate_percent: number
  active_agents: number
}

export interface HealthCheckResponse {
  status: string
  service: string
}
