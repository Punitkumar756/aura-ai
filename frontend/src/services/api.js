/**
 * API Service - Handles all backend API calls
 */

const API = {
    baseURL: 'http://localhost:8000',
    
    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`API Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    },

    /**
     * Health Check
     */
    async checkHealth() {
        try {
            await this.request('/health');
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Get Dashboard Metrics
     */
    async getMetrics() {
        try {
            return await this.request('/api/metrics');
        } catch {
            return getDefaultMetrics();
        }
    },

    /**
     * Get Pipeline Failures
     */
    async getPipelineFailures() {
        try {
            return await this.request('/api/pipeline-failures');
        } catch {
            return getDefaultFailures();
        }
    },

    /**
     * Get Events
     */
    async getEvents(page = 1, limit = 10) {
        try {
            return await this.request(`/api/events?page=${page}&limit=${limit}`);
        } catch {
            return getDefaultEvents(page, limit);
        }
    },

    /**
     * Get Single Event
     */
    async getEvent(eventId) {
        try {
            return await this.request(`/api/events/${eventId}`);
        } catch {
            return null;
        }
    },

    /**
     * Get Agent Status
     */
    async getAgentStatus() {
        try {
            return await this.request('/api/agents/status');
        } catch {
            return getDefaultAgents();
        }
    },

    /**
     * Get Latest Decision
     */
    async getLatestDecision() {
        try {
            return await this.request('/api/agents/latest-decision');
        } catch {
            return getDefaultDecision();
        }
    },

    /**
     * Trigger Test Failure
     */
    async triggerTestFailure() {
        try {
            return await this.request('/api/test/trigger-pipeline-failure', {
                method: 'POST',
            });
        } catch (error) {
            throw error;
        }
    },
};

/**
 * Default Mock Data
 */

function getDefaultMetrics() {
    return {
        total_failures: 24,
        avg_diagnosis_time: 5.2,
        success_rate: 92,
        active_agents: 3,
    };
}

function getDefaultFailures() {
    return [
        {
            id: 'pf-1',
            project_name: 'aura-ai',
            error_type: 'TEST_FAILURE',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            status: 'resolved',
            diagnosis: 'Unit test assertion failure in auth module',
            mr_url: '#',
        },
        {
            id: 'pf-2',
            project_name: 'dashboard-app',
            error_type: 'LINT_ERROR',
            timestamp: new Date(Date.now() - 240000).toISOString(),
            status: 'resolved',
            diagnosis: 'Code style violation in component',
            mr_url: '#',
        },
        {
            id: 'pf-3',
            project_name: 'api-server',
            error_type: 'DEPENDENCY_ERROR',
            timestamp: new Date(Date.now() - 360000).toISOString(),
            status: 'pending',
            diagnosis: 'Missing package in requirements',
            mr_url: '#',
        },
    ];
}

function getDefaultEvents(page = 1, limit = 10) {
    const events = [
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
            agent: 'Test Orchestrator',
            status: 'pending',
            timestamp: new Date(Date.now() - 240000).toISOString(),
        },
        {
            id: 'ev-3',
            type: 'SECURITY_SCAN',
            project: 'api-server',
            agent: 'Compliance Agent',
            status: 'completed',
            timestamp: new Date(Date.now() - 360000).toISOString(),
        },
    ];

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEvents = events.slice(start, end);

    return {
        total: events.length,
        page,
        limit,
        events: paginatedEvents,
    };
}

function getDefaultAgents() {
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
            name: 'Test Orchestrator',
            status: 'IDLE',
            last_activity: new Date(Date.now() - 300000).toISOString(),
            successes: 45,
            failures: 5,
        },
        {
            id: 'sec-1',
            name: 'Compliance Agent',
            status: 'ACTIVE',
            last_activity: new Date(Date.now() - 30000).toISOString(),
            successes: 12,
            failures: 1,
        },
    ];
}

function getDefaultDecision() {
    return {
        id: 'dec-1',
        agent: 'Pipeline Guardian',
        decision: 'Create fix PR for failing test suite in authentication module',
        confidence: 0.94,
        timestamp: new Date(Date.now() - 60000).toISOString(),
    };
}
