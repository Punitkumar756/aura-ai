/**
 * AURA AI - SIMPLE DASHBOARD
 * Minimal, easy-to-understand JavaScript
 */

const API_URL = 'http://localhost:8000';

// ===== DOM Elements =====
const statFailures = document.getElementById('stat-failures');
const statResolved = document.getElementById('stat-resolved');
const statAgents = document.getElementById('stat-agents');
const statSuccess = document.getElementById('stat-success');
const failuresList = document.getElementById('failures');
const agentsList = document.getElementById('agents');
const decisionBox = document.getElementById('decision');
const statusBadge = document.getElementById('status');
const testBtn = document.getElementById('test-btn');

// ===== MAIN FUNCTIONS =====

/**
 * Load all data from API
 */
async function loadData() {
    try {
        // Fetch all data in parallel
        const [metrics, failures, agents, decision] = await Promise.all([
            fetch(`${API_URL}/api/metrics`).then(r => r.json()).catch(() => getDefaultMetrics()),
            fetch(`${API_URL}/api/pipeline-failures`).then(r => r.json()).catch(() => getDefaultFailures()),
            fetch(`${API_URL}/api/agents/status`).then(r => r.json()).catch(() => getDefaultAgents()),
            fetch(`${API_URL}/api/agents/latest-decision`).then(r => r.json()).catch(() => getDefaultDecision()),
        ]);

        // Update UI
        updateStats(metrics);
        updateFailures(failures);
        updateAgents(agents);
        updateDecision(decision);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * Update statistics cards
 */
function updateStats(metrics) {
    statFailures.textContent = metrics.total_failures || 0;
    statResolved.textContent = metrics.success_rate ? Math.round(metrics.success_rate * 0.8) : 0; // Estimate resolved
    statAgents.textContent = metrics.active_agents || 0;
    statSuccess.textContent = (metrics.success_rate || 0) + '%';
}

/**
 * Update failures list
 */
function updateFailures(failures) {
    if (!failures || failures.length === 0) {
        failuresList.innerHTML = '<div class="empty">No recent failures</div>';
        return;
    }

    failuresList.innerHTML = failures
        .slice(0, 5)
        .map(f => `
            <div class="item">
                <div class="item-info">
                    <div class="item-title">${f.project_name}</div>
                    <div class="item-time">${timeAgo(f.timestamp)}</div>
                </div>
                <span class="item-badge">${f.error_type}</span>
            </div>
        `)
        .join('');
}

/**
 * Update agents list
 */
function updateAgents(agents) {
    if (!agents || agents.length === 0) {
        agentsList.innerHTML = '<div class="empty">No agents available</div>';
        return;
    }

    agentsList.innerHTML = agents
        .map(a => {
            const statusClass = a.status === 'ACTIVE' ? 'status-active' : a.status === 'ERROR' ? 'status-error' : 'status-idle';
            return `
                <div class="item">
                    <div class="item-info">
                        <div class="item-title">${a.name}</div>
                        <div class="item-time">Success: ${a.successes || 0} | Failed: ${a.failures || 0}</div>
                    </div>
                    <span class="item-status ${statusClass}">${a.status}</span>
                </div>
            `;
        })
        .join('');
}

/**
 * Update latest decision
 */
function updateDecision(decision) {
    if (!decision) {
        decisionBox.innerHTML = '<div class="empty">No recent decisions</div>';
        return;
    }

    const confidence = Math.round(decision.confidence * 100);
    decisionBox.innerHTML = `
        <div class="decision-header">
            <div class="decision-title">${decision.agent}</div>
            <div class="confidence">${confidence}% Sure</div>
        </div>
        <div class="decision-content">
            ${decision.decision}
        </div>
        <div class="decision-time">${timeAgo(decision.timestamp)}</div>
    `;
}

/**
 * Check backend health
 */
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const isOnline = response.ok;
        statusBadge.textContent = isOnline ? '● Online' : '● Offline';
        statusBadge.className = isOnline ? 'status-badge online' : 'status-badge offline';
    } catch {
        statusBadge.textContent = '● Offline';
        statusBadge.className = 'status-badge offline';
    }
}

/**
 * Handle test failure trigger
 */
async function triggerTest() {
    testBtn.disabled = true;
    testBtn.textContent = 'Triggering...';

    try {
        const response = await fetch(`${API_URL}/api/test/trigger-pipeline-failure`, {
            method: 'POST',
        });
        if (response.ok) {
            testBtn.textContent = 'Test Triggered! ✓';
            setTimeout(() => {
                testBtn.disabled = false;
                testBtn.textContent = 'Trigger Test Failure';
                loadData(); // Refresh data
            }, 2000);
        }
    } catch (error) {
        console.error('Error triggering test:', error);
        testBtn.textContent = 'Error - Try Again';
        testBtn.disabled = false;
    }
}

/**
 * Format time as "X minutes ago"
 */
function timeAgo(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ===== DEFAULT DATA (Mock Data) =====

function getDefaultMetrics() {
    return {
        total_failures: 24,
        avg_diagnosis_time: 5,
        success_rate: 92,
        active_agents: 3,
    };
}

function getDefaultFailures() {
    return [
        {
            project_name: 'aura-ai',
            error_type: 'TEST_FAILURE',
            timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
            project_name: 'dashboard-app',
            error_type: 'LINT_ERROR',
            timestamp: new Date(Date.now() - 240000).toISOString(),
        },
        {
            project_name: 'api-server',
            error_type: 'DEPENDENCY_ERROR',
            timestamp: new Date(Date.now() - 360000).toISOString(),
        },
    ];
}

function getDefaultAgents() {
    return [
        {
            name: 'Pipeline Guardian',
            status: 'ACTIVE',
            successes: 18,
            failures: 2,
        },
        {
            name: 'QA Agent',
            status: 'IDLE',
            successes: 45,
            failures: 5,
        },
        {
            name: 'Security Agent',
            status: 'ACTIVE',
            successes: 12,
            failures: 1,
        },
    ];
}

function getDefaultDecision() {
    return {
        agent: 'Pipeline Guardian',
        decision: 'Create fix PR for failing test suite in the authentication module',
        confidence: 0.94,
        timestamp: new Date(Date.now() - 60000).toISOString(),
    };
}

// ===== START APP =====

document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    checkHealth();
    loadData();

    // Set up event listeners
    testBtn.addEventListener('click', triggerTest);

    // Auto-refresh every 3 seconds
    setInterval(() => {
        checkHealth();
        loadData();
    }, 3000);
});
