/**
 * API Client - Handles all HTTP requests to the backend
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
}

/**
 * API Methods
 */
const API = {
    // Health Check
    async checkHealth() {
        try {
            await apiCall('/health');
            return true;
        } catch {
            return false;
        }
    },

    // Metrics
    async getMetrics() {
        try {
            return await apiCall('/api/metrics');
        } catch {
            // Return mock data for development
            return {
                total_failures: 24,
                avg_diagnosis_time: 5.2,
                success_rate: 92,
                active_agents: 3,
            };
        }
    },

    // Agents
    async getAgentStatus() {
        try {
            return await apiCall('/api/agents/status');
        } catch {
            // Return mock data
            return [
                {
                    id: 'pg-1',
                    name: 'Pipeline Guardian',
                    status: 'ACTIVE',
                    last_activity: new Date(Date.now() - 60000).toISOString(),
                    successes: 18,
                    failures: 2,
                },
                {
                    id: 'qa-1',
                    name: 'QA Agent',
                    status: 'IDLE',
                    last_activity: new Date(Date.now() - 300000).toISOString(),
                    successes: 45,
                    failures: 5,
                },
                {
                    id: 'sec-1',
                    name: 'Security Agent',
                    status: 'ACTIVE',
                    last_activity: new Date(Date.now() - 30000).toISOString(),
                    successes: 12,
                    failures: 1,
                },
            ];
        }
    },

    // Pipeline Failures
    async getPipelineFailures() {
        try {
            return await apiCall('/api/pipeline-failures');
        } catch {
            // Return mock data
            return [
                {
                    id: 'pf-1',
                    project_name: 'aura-ai',
                    error_type: 'TEST_FAILURE',
                    timestamp: new Date(Date.now() - 120000).toISOString(),
                    status: 'resolved',
                },
                {
                    id: 'pf-2',
                    project_name: 'dashboard-app',
                    error_type: 'LINT_ERROR',
                    timestamp: new Date(Date.now() - 240000).toISOString(),
                    status: 'resolved',
                },
                {
                    id: 'pf-3',
                    project_name: 'api-server',
                    error_type: 'DEPENDENCY_ERROR',
                    timestamp: new Date(Date.now() - 360000).toISOString(),
                    status: 'resolved',
                },
            ];
        }
    },

    // Events
    async getEvents(page = 1, limit = 20) {
        try {
            return await apiCall(`/api/events?page=${page}&limit=${limit}`);
        } catch {
            // Return mock data
            return {
                total: 150,
                page,
                limit,
                events: [
                    {
                        id: 'ev-1',
                        type: 'PIPELINE_FAILED',
                        project: 'aura-ai',
                        agent: 'Pipeline Guardian',
                        status: 'completed',
                        timestamp: new Date(Date.now() - 120000).toISOString(),
                    },
                    {
                        id: 'ev-2',
                        type: 'MR_OPENED',
                        project: 'dashboard-app',
                        agent: 'Code Review Agent',
                        status: 'pending',
                        timestamp: new Date(Date.now() - 240000).toISOString(),
                    },
                    {
                        id: 'ev-3',
                        type: 'SECURITY_SCAN',
                        project: 'api-server',
                        agent: 'Security Agent',
                        status: 'completed',
                        timestamp: new Date(Date.now() - 360000).toISOString(),
                    },
                ],
            };
        }
    },

    // Latest Decision
    async getLatestDecision() {
        try {
            return await apiCall('/api/agents/latest-decision');
        } catch {
            // Return mock data
            return {
                id: 'dec-1',
                agent: 'Pipeline Guardian',
                decision: 'Create fix PR for failing test suite',
                confidence: 0.94,
                timestamp: new Date(Date.now() - 60000).toISOString(),
            };
        }
    },

    // Test trigger
    async triggerTestFailure() {
        try {
            return await apiCall('/api/test/trigger-pipeline-failure', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Failed to trigger test failure:', error);
            throw error;
        }
    },
};

/**
 * Format utilities
 */
function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

function getEventTypeClass(type) {
    return type
        .toLowerCase()
        .replace(/_/g, '-');
}
