/**
 * Pipeline Failures Page
 */

const Failures = {
    allFailures: [],
    filteredFailures: [],

    async load() {
        try {
            this.allFailures = await API.getPipelineFailures();
            this.render();
            this.setupFilters();
        } catch (error) {
            console.error('Failures load error:', error);
        }
    },

    render() {
        const container = document.getElementById('failures-list');
        
        if (!this.filteredFailures || this.filteredFailures.length === 0) {
            container.innerHTML = '<div class="empty">No failures found</div>';
            return;
        }

        container.innerHTML = this.filteredFailures
            .map(f => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${f.project_name}</div>
                        <div class="list-item-subtitle">
                            ${Formatters.errorType(f.error_type)} • ${Formatters.timeAgo(f.timestamp)}
                        </div>
                        <div class="list-item-subtitle">${f.diagnosis || 'No diagnosis yet'}</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="list-item-badge ${Formatters.statusBadge(f.status).class}">
                            ${Formatters.statusBadge(f.status).text}
                        </span>
                        <button class="btn btn-small" onclick="Failures.viewDetails('${f.id}')">Details</button>
                    </div>
                </div>
            `)
            .join('');
    },

    setupFilters() {
        const searchInput = document.getElementById('search-failures');
        const statusFilter = document.getElementById('filter-status');

        searchInput.addEventListener('input', () => this.applyFilters());
        statusFilter.addEventListener('change', () => this.applyFilters());
    },

    applyFilters() {
        const search = document.getElementById('search-failures').value.toLowerCase();
        const status = document.getElementById('filter-status').value;

        this.filteredFailures = this.allFailures.filter(f => {
            const matchSearch = !search || 
                f.project_name.toLowerCase().includes(search) ||
                f.error_type.toLowerCase().includes(search);
            
            const matchStatus = !status || f.status === status;

            return matchSearch && matchStatus;
        });

        this.render();
    },

    viewDetails(id) {
        const failure = this.allFailures.find(f => f.id === id);
        if (!failure) return;

        const html = `
            <div class="p-3">
                <h4>${failure.project_name}</h4>
                <div class="divider"></div>
                
                <div class="detail-row">
                    <span class="detail-label">Error Type:</span>
                    <span class="detail-value">${Formatters.errorType(failure.error_type)}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="list-item-badge ${Formatters.statusBadge(failure.status).class}">
                            ${Formatters.statusBadge(failure.status).text}
                        </span>
                    </span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${Formatters.timestamp(failure.timestamp)}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Diagnosis:</span>
                    <span class="detail-value">${failure.diagnosis || 'Analyzing...'}</span>
                </div>
                
                ${failure.mr_url && failure.mr_url !== '#' ? `
                    <div class="mt-3">
                        <a href="${failure.mr_url}" target="_blank" class="btn btn-primary">View MR</a>
                    </div>
                ` : ''}
            </div>
        `;

        Modal.show(html);
    },
};
