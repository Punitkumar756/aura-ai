/**
 * Dashboard Page
 */

const Dashboard = {
    async load() {
        try {
            const [metrics, failures, agents, decision] = await Promise.all([
                API.getMetrics(),
                API.getPipelineFailures(),
                API.getAgentStatus(),
                API.getLatestDecision(),
            ]);

            this.updateMetrics(metrics);
            this.updateFailures(failures);
            this.updateAgents(agents);
            this.updateDecision(decision);
        } catch (error) {
            console.error('Dashboard load error:', error);
        }
    },

    updateMetrics(metrics) {
        document.getElementById('metric-failures').textContent = metrics.total_failures || 0;
        document.getElementById('metric-diagnosis').textContent = (metrics.avg_diagnosis_time || 0) + 'm';
        document.getElementById('metric-success').textContent = (metrics.success_rate || 0) + '%';
        document.getElementById('metric-agents').textContent = metrics.active_agents || 0;
    },

    updateFailures(failures) {
        const container = document.getElementById('dashboard-failures-list');
        
        if (!failures || failures.length === 0) {
            container.innerHTML = '<div class="empty">No recent failures</div>';
            return;
        }

        container.innerHTML = failures
            .slice(0, 5)
            .map(f => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${f.project_name}</div>
                        <div class="list-item-subtitle">${Formatters.timeAgo(f.timestamp)}</div>
                    </div>
                    <span class="list-item-badge badge-danger">${Formatters.errorType(f.error_type).split(' ')[1]}</span>
                </div>
            `)
            .join('');
    },

    updateAgents(agents) {
        const container = document.getElementById('dashboard-agents-list');
        
        if (!agents || agents.length === 0) {
            container.innerHTML = '<div class="empty">No agents</div>';
            return;
        }

        container.innerHTML = agents
            .map(a => {
                const statusClass = `status-${a.status.toLowerCase()}`;
                return `
                    <div class="list-item">
                        <div class="list-item-info">
                            <div class="list-item-title">${a.name}</div>
                            <div class="list-item-subtitle">✓ ${a.successes} | ✗ ${a.failures}</div>
                        </div>
                        <span class="list-item-badge ${statusClass}">${a.status}</span>
                    </div>
                `;
            })
            .join('');
    },

    updateDecision(decision) {
        const container = document.getElementById('latest-decision');
        
        if (!decision) {
            container.innerHTML = '<div class="empty">No recent decisions</div>';
            return;
        }

        container.innerHTML = `
            <div class="decision-header">
                <div class="decision-agent">${decision.agent}</div>
                <div class="confidence-badge">${Formatters.confidence(decision.confidence)}</div>
            </div>
            <div class="decision-text">${decision.decision}</div>
            <div class="decision-time">${Formatters.timeAgo(decision.timestamp)}</div>
        `;
    },
};
