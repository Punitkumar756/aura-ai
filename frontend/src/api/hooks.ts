import { useQuery, UseQueryResult } from '@tanstack/react-query'
import client from './client'
import * as Types from '@/types'

const QUERY_KEYS = {
  health: ['health'],
  agentStatus: ['agentStatus'],
  pipelineFailures: ['pipelineFailures'],
  eventLog: ['eventLog'],
  metrics: ['metrics'],
  eventDetails: (eventId: string) => ['eventDetails', eventId],
}

// Health check
export const useHealthCheck = (): UseQueryResult<Types.HealthCheckResponse, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: async () => {
      const response = await client.get('/health')
      return response.data
    },
    refetchInterval: 5000, // Poll every 5 seconds
  })
}

// Agent status
export const useAgentStatus = (): UseQueryResult<Types.AgentStatus[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.agentStatus,
    queryFn: async () => {
      try {
        const response = await client.post('/api/agents/status')
        return response.data?.agents || getMockAgentStatus()
      } catch {
        return getMockAgentStatus()
      }
    },
    refetchInterval: 3000, // Poll every 3 seconds
  })
}

// Pipeline failures
export const usePipelineFailures = (): UseQueryResult<Types.EventLog[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.pipelineFailures,
    queryFn: async () => {
      try {
        const response = await client.get('/api/pipeline-failures')
        return response.data?.failures || getMockPipelineFailures()
      } catch {
        return getMockPipelineFailures()
      }
    },
    refetchInterval: 3000, // Poll every 3 seconds
  })
}

// Event log
export const useEventLog = (
  page = 1,
  limit = 20
): UseQueryResult<{ events: Types.EventLog[]; total: number }, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.eventLog,
    queryFn: async () => {
      try {
        const response = await client.get('/api/events', { params: { page, limit } })
        return response.data || getMockEventLog()
      } catch {
        return getMockEventLog()
      }
    },
    refetchInterval: 5000,
  })
}

// Dashboard metrics
export const useDashboardMetrics = (): UseQueryResult<Types.DashboardMetrics, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.metrics,
    queryFn: async () => {
      try {
        const response = await client.get('/api/metrics')
        return response.data || getMockMetrics()
      } catch {
        return getMockMetrics()
      }
    },
    refetchInterval: 5000,
  })
}

// Event details
export const useEventDetails = (
  eventId: string
): UseQueryResult<Types.EventLog, Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.eventDetails(eventId),
    queryFn: async () => {
      const response = await client.get(`/api/events/${eventId}`)
      return response.data
    },
  })
}

// Mock data for development
const getMockAgentStatus = (): Types.AgentStatus[] => [
  {
    agent_name: 'Pipeline Guardian',
    status: 'ACTIVE',
    last_activity: new Date(Date.now() - 2000).toISOString(),
    errors: 0,
    successes: 12,
  },
  {
    agent_name: 'Compliance Agent',
    status: 'IDLE',
    last_activity: new Date(Date.now() - 3600000).toISOString(),
    errors: 0,
    successes: 3,
  },
  {
    agent_name: 'Test Orchestrator',
    status: 'IDLE',
    last_activity: new Date(Date.now() - 7200000).toISOString(),
    errors: 0,
    successes: 1,
  },
]

const getMockPipelineFailures = (): Types.EventLog[] => [
  {
    event_id: 'evt-001',
    event_type: Types.EventType.PIPELINE_FAILED,
    project_name: 'example-project',
    status: 'RESOLVED',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    agent_name: 'Pipeline Guardian',
    action_status: 'MR_CREATED',
    details: {
      failure_type: 'IMPORT_ERROR',
      diagnosis: 'Missing requests module',
      mr_url: '#',
    },
  },
  {
    event_id: 'evt-002',
    event_type: Types.EventType.PIPELINE_FAILED,
    project_name: 'another-project',
    status: 'PENDING',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    agent_name: 'Pipeline Guardian',
    action_status: 'DIAGNOSING',
    details: {
      failure_type: 'TEST_FAILURE',
      diagnosis: 'Unit test assertion failed',
    },
  },
  {
    event_id: 'evt-003',
    event_type: Types.EventType.PIPELINE_FAILED,
    project_name: 'test-repo',
    status: 'RESOLVED',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    agent_name: 'Pipeline Guardian',
    action_status: 'MR_CREATED',
    details: {
      failure_type: 'LINT_ERROR',
      diagnosis: 'Code formatting issues',
      mr_url: '#',
    },
  },
]

const getMockEventLog = () => ({
  events: getMockPipelineFailures(),
  total: 42,
})

const getMockMetrics = (): Types.DashboardMetrics => ({
  total_failures_today: 8,
  avg_diagnosis_time_ms: 1450,
  success_rate_percent: 87.5,
  active_agents: 1,
})
