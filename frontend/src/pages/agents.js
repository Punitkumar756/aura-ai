/**
 * Agents Page
 */

const Agents = {
    agents: [],
    selectedAgent: null,

    async load() {
        try {
            this.agents = await API.getAgentStatus();
            this.renderGrid();
            if (this.agents.length > 0) {
                this.selectAgent(this.agents[0].id);
            }
        } catch (error) {
            console.error('Agents load error:', error);
        }
    },

    renderGrid() {
        const container = document.getElementById('agents-grid');
        
        if (!this.agents || this.agents.length === 0) {
            container.innerHTML = '<div class="empty">No agents available</div>';
            return;
        }

        container.innerHTML = this.agents
            .map(a => {
                const statusClass = `status-${a.status.toLowerCase()}`;
                return `
                    <div class="agent-card" onclick="Agents.selectAgent('${a.id}')">
                        <div class="agent-name">${a.name}</div>
                        <span class="agent-status ${statusClass}">${a.status}</span>
                        <div class="agent-stats">
                            <div>✓ Successes: ${a.successes || 0}</div>
                            <div>✗ Failures: ${a.failures || 0}</div>
                            <div>Last active: ${Formatters.timeAgo(a.last_activity)}</div>
                        </div>
                    </div>
                `;
            })
            .join('');
    },

    selectAgent(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (!agent) return;

        this.selectedAgent = agent;
        this.renderDetails();

        // Update visual selection
        document.querySelectorAll('.agent-card').forEach(card => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
        });
        event.target.closest('.agent-card').style.borderColor = 'var(--color-primary)';
        event.target.closest('.agent-card').style.boxShadow = 'var(--shadow-md)';
    },

    renderDetails() {
        const container = document.getElementById('agent-details');
        
        if (!this.selectedAgent) {
            container.innerHTML = '<div class="empty">Select an agent to view details</div>';
            return;
        }

        const a = this.selectedAgent;
        const successRate = (a.successes + a.failures) > 0 
            ? Math.round((a.successes / (a.successes + a.failures)) * 100) 
            : 0;

        container.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Agent Name:</span>
                <span class="detail-value"><strong>${a.name}</strong></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">
                    <span class="list-item-badge status-${a.status.toLowerCase()}">
                        ${a.status}
                    </span>
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Total Tasks:</span>
                <span class="detail-value">${a.successes + a.failures}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Successful Tasks:</span>
                <span class="detail-value text-success"><strong>${a.successes}</strong></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Failed Tasks:</span>
                <span class="detail-value text-danger"><strong>${a.failures}</strong></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Success Rate:</span>
                <span class="detail-value">
                    <div class="progress-bar" style="width: 150px;">
                        <div class="progress-fill" style="width: ${successRate}%;"></div>
                    </div>
                    ${successRate}%
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Last Activity:</span>
                <span class="detail-value">${Formatters.timestamp(a.last_activity)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Time Since Activity:</span>
                <span class="detail-value">${Formatters.timeAgo(a.last_activity)}</span>
            </div>
            
            <div class="mt-3">
                <button class="btn btn-secondary">View Action History</button>
                <button class="btn btn-secondary">View Configuration</button>
            </div>
        `;
    },
};
