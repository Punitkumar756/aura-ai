/**
 * Main App Logic - Handles routing, data loading, and UI updates
 */

// State
let appState = {
    currentPage: 'dashboard',
    eventsPage: 1,
    eventLimit: 20,
    charts: {},
};

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');
const statusIndicator = document.getElementById('status-indicator');

// Page names for title mapping
const pageTitles = {
    dashboard: 'Dashboard',
    events: 'Events Log',
    analytics: 'Analytics',
    settings: 'Settings',
};

/**
 * Initialize App
 */
function initApp() {
    setupRouting();
    setupEventListeners();
    startPolling();
    loadDashboard();
}

/**
 * Setup routing
 */
function setupRouting() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.substring(1) || 'dashboard';
        navigateTo(page);
    });
}

/**
 * Navigate to page
 */
function navigateTo(page) {
    if (!['dashboard', 'events', 'analytics', 'settings'].includes(page)) {
        page = 'dashboard';
    }

    appState.currentPage = page;

    // Update URL
    window.location.hash = page;

    // Update nav
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Update page
    pages.forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });

    // Update title
    pageTitle.textContent = pageTitles[page];

    // Load page-specific content
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'events':
            loadEvents();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

/**
 * Load Dashboard
 */
async function loadDashboard() {
    try {
        const [metrics, failures, agents, decision] = await Promise.all([
            API.getMetrics(),
            API.getPipelineFailures(),
            API.getAgentStatus(),
            API.getLatestDecision(),
        ]);

        updateMetrics(metrics);
        updateFailuresList(failures);
        updateAgentsList(agents);
        updateLatestDecision(decision);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

/**
 * Update metrics cards
 */
function updateMetrics(metrics) {
    document.getElementById('total-failures').textContent = metrics.total_failures || '--';
    document.getElementById('avg-diagnosis-time').textContent = (metrics.avg_diagnosis_time || 0).toFixed(1);
    document.getElementById('success-rate').textContent = (metrics.success_rate || 0) + '%';
    document.getElementById('active-agents').textContent = metrics.active_agents || '--';
}

/**
 * Update failures list
 */
function updateFailuresList(failures) {
    const container = document.getElementById('failures-list');

    if (!failures || failures.length === 0) {
        container.innerHTML = '<div class="loading">No failures</div>';
        return;
    }

    container.innerHTML = failures
        .slice(0, 5)
        .map(failure => `
            <div class="failure-item">
                <div class="failure-info">
                    <div class="failure-title">${failure.project_name}</div>
                    <div class="failure-time">${formatTime(failure.timestamp)}</div>
                </div>
                <span class="failure-badge">${failure.error_type}</span>
            </div>
        `)
        .join('');
}

/**
 * Update agents list
 */
function updateAgentsList(agents) {
    const container = document.getElementById('agents-list');

    if (!agents || agents.length === 0) {
        container.innerHTML = '<div class="loading">No agents</div>';
        return;
    }

    container.innerHTML = agents
        .map(agent => {
            const isActive = agent.status === 'ACTIVE';
            return `
                <div class="agent-item">
                    <div class="agent-info">
                        <div class="agent-name">
                            <span class="status-dot" style="background-color: ${isActive ? '#10b981' : '#9ca3af'}"></span>
                            ${agent.name}
                        </div>
                        <div class="agent-stats">
                            ✓ ${agent.successes || 0} | ✗ ${agent.failures || 0}
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');
}

/**
 * Update latest decision
 */
function updateLatestDecision(decision) {
    const container = document.getElementById('latest-decision');

    if (!decision) {
        container.innerHTML = '<div class="loading">No recent decisions</div>';
        return;
    }

    container.innerHTML = `
        <div class="decision-header">
            <div class="decision-title">${decision.agent}</div>
            <div class="confidence-score">
                ${(decision.confidence * 100).toFixed(0)}% Confidence
            </div>
        </div>
        <div class="decision-content">
            ${decision.decision}
        </div>
        <div class="failure-time" style="margin-top: 1rem;">
            ${formatTime(decision.timestamp)}
        </div>
    `;
}

/**
 * Load Events
 */
async function loadEvents() {
    try {
        const data = await API.getEvents(appState.eventsPage, appState.eventLimit);
        updateEventsList(data);
    } catch (error) {
        console.error('Failed to load events:', error);
    }
}

/**
 * Update events table
 */
function updateEventsList(data) {
    const tbody = document.getElementById('events-tbody');

    if (!data.events || data.events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No events found</td></tr>';
        return;
    }

    tbody.innerHTML = data.events
        .map(event => `
            <tr>
                <td>
                    <span class="event-type ${getEventTypeClass(event.type)}">
                        ${event.type}
                    </span>
                </td>
                <td>${event.project}</td>
                <td>${event.agent}</td>
                <td>
                    <span class="event-status ${event.status}">
                        ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                </td>
                <td>${formatTime(event.timestamp)}</td>
            </tr>
        `)
        .join('');

    // Update pagination
    const totalPages = Math.ceil(data.total / data.limit);
    document.getElementById('page-info').textContent = `Page ${appState.eventsPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = appState.eventsPage === 1;
    document.getElementById('next-page').disabled = appState.eventsPage === totalPages;
}

/**
 * Load Analytics
 */
async function loadAnalytics() {
    // Generate mock data for charts
    const chartData = generateChartData();
    initCharts(chartData);
}

/**
 * Generate mock chart data
 */
function generateChartData() {
    const hours = 24;
    const failuresData = [];
    const mttrData = [];

    for (let i = hours - 1; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        const label = hour.getHours() + ':00';

        failuresData.push({
            time: label,
            failures: Math.floor(Math.random() * 8) + 1,
        });

        mttrData.push({
            time: label,
            mttr: Math.floor(Math.random() * 30) + 10,
        });
    }

    const errorTypes = {
        'TEST_FAILURE': Math.floor(Math.random() * 50) + 20,
        'LINT_ERROR': Math.floor(Math.random() * 30) + 10,
        'IMPORT_ERROR': Math.floor(Math.random() * 20) + 5,
        'CONFIG_ERROR': Math.floor(Math.random() * 25) + 8,
        'SYNTAX_ERROR': Math.floor(Math.random() * 15) + 5,
    };

    return {
        failuresData,
        mttrData,
        errorTypes,
    };
}

/**
 * Initialize charts
 */
function initCharts(data) {
    // Failures Chart
    initFailuresChart(data.failuresData);

    // Error Types Chart
    initErrorsChart(data.errorTypes);

    // MTTR Chart
    initMTTRChart(data.mttrData);
}

/**
 * Failures over time chart
 */
function initFailuresChart(data) {
    const ctx = document.getElementById('failures-chart');
    if (!ctx) return;

    if (appState.charts.failures) {
        appState.charts.failures.destroy();
    }

    appState.charts.failures = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.time),
            datasets: [
                {
                    label: 'Pipeline Failures',
                    data: data.map(d => d.failures),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}

/**
 * Error types distribution chart
 */
function initErrorsChart(data) {
    const ctx = document.getElementById('errors-chart');
    if (!ctx) return;

    if (appState.charts.errors) {
        appState.charts.errors.destroy();
    }

    appState.charts.errors = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    data: Object.values(data),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6',
                    ],
                    borderColor: '#fff',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
            },
        },
    });
}

/**
 * MTTR chart
 */
function initMTTRChart(data) {
    const ctx = document.getElementById('mttr-chart');
    if (!ctx) return;

    if (appState.charts.mttr) {
        appState.charts.mttr.destroy();
    }

    appState.charts.mttr = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.time),
            datasets: [
                {
                    label: 'MTTR (minutes)',
                    data: data.map(d => d.mttr),
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}

/**
 * Load Settings
 */
function loadSettings() {
    // Settings page is mostly static
    const confidenceSlider = document.querySelector('#settings-page .slider');
    if (confidenceSlider) {
        confidenceSlider.addEventListener('input', (e) => {
            document.getElementById('confidence-value').textContent = e.target.value + '%';
        });
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Events pagination
    document.getElementById('prev-page').addEventListener('click', () => {
        if (appState.eventsPage > 1) {
            appState.eventsPage--;
            loadEvents();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        appState.eventsPage++;
        loadEvents();
    });

    // Events search and filter
    document.getElementById('search-events').addEventListener('input', (e) => {
        // Simple client-side search
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#events-tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });

    document.getElementById('filter-type').addEventListener('change', (e) => {
        const type = e.target.value;
        const rows = document.querySelectorAll('#events-tbody tr');
        rows.forEach(row => {
            if (!type) {
                row.style.display = '';
            } else {
                const typeCell = row.querySelector('td:first-child');
                row.style.display = typeCell.textContent.includes(type) ? '' : 'none';
            }
        });
    });
}

/**
 * Start polling for real-time updates
 */
function startPolling() {
    // Check health every 5s
    setInterval(async () => {
        const isHealthy = await API.checkHealth();
        const indicator = document.getElementById('status-indicator');
        if (isHealthy) {
            indicator.textContent = 'Online';
            indicator.className = 'status-badge status-online';
        } else {
            indicator.textContent = 'Offline';
            indicator.className = 'status-badge status-offline';
        }
    }, 5000);

    // Update dashboard every 3s (only if on dashboard)
    setInterval(() => {
        if (appState.currentPage === 'dashboard') {
            loadDashboard();
        }
    }, 3000);

    // Update events every 5s (only if on events page)
    setInterval(() => {
        if (appState.currentPage === 'events') {
            loadEvents();
        }
    }, 5000);
}

/**
 * Initialize app on page load
 */
document.addEventListener('DOMContentLoaded', initApp);
