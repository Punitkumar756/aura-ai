/**
 * Events Log Page
 */

const Events = {
    currentPage: 1,
    pageSize: 10,
    totalEvents: 0,
    allEvents: [],

    async load() {
        try {
            this.currentPage = 1;
            await this.loadPage();
            this.setupFilters();
        } catch (error) {
            console.error('Events load error:', error);
        }
    },

    async loadPage() {
        try {
            const data = await API.getEvents(this.currentPage, this.pageSize);
            this.allEvents = data.events || [];
            this.totalEvents = data.total || 0;
            this.render();
            this.updatePagination();
        } catch (error) {
            console.error('Error loading events:', error);
        }
    },

    render() {
        const tbody = document.getElementById('events-tbody');
        
        if (!this.allEvents || this.allEvents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">No events found</td></tr>';
            return;
        }

        tbody.innerHTML = this.allEvents
            .map(e => `
                <tr>
                    <td><strong>${Formatters.eventType(e.type).split(' ')[0]}</strong></td>
                    <td>${e.project}</td>
                    <td>${e.agent}</td>
                    <td>
                        <span class="list-item-badge ${Formatters.statusBadge(e.status).class}">
                            ${Formatters.statusBadge(e.status).text}
                        </span>
                    </td>
                    <td>${Formatters.timeAgo(e.timestamp)}</td>
                    <td>
                        <button class="btn btn-small" onclick="Events.viewEvent('${e.id}')">View</button>
                    </td>
                </tr>
            `)
            .join('');
    },

    updatePagination() {
        const totalPages = Math.ceil(this.totalEvents / this.pageSize);
        document.getElementById('page-info').textContent = `Page ${this.currentPage} of ${totalPages}`;
        document.getElementById('prev-page-btn').disabled = this.currentPage === 1;
        document.getElementById('next-page-btn').disabled = this.currentPage === totalPages;
    },

    setupFilters() {
        document.getElementById('prev-page-btn').addEventListener('click', () => this.prevPage());
        document.getElementById('next-page-btn').addEventListener('click', () => this.nextPage());
        document.getElementById('filter-event-type').addEventListener('change', () => this.load());
    },

    async nextPage() {
        const totalPages = Math.ceil(this.totalEvents / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            await this.loadPage();
        }
    },

    async prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.loadPage();
        }
    },

    async viewEvent(id) {
        try {
            const event = this.allEvents.find(e => e.id === id);
            if (!event) return;

            const html = `
                <div class="p-3">
                    <h4>${Formatters.eventType(event.type)}</h4>
                    <div class="divider"></div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Project:</span>
                        <span class="detail-value">${event.project}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Agent:</span>
                        <span class="detail-value">${event.agent}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="list-item-badge ${Formatters.statusBadge(event.status).class}">
                                ${Formatters.statusBadge(event.status).text}
                            </span>
                        </span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${Formatters.timestamp(event.timestamp)}</span>
                    </div>
                    
                    <div class="mt-2">
                        <div class="code">${JSON.stringify(event, null, 2)}</div>
                    </div>
                </div>
            `;

            Modal.show(html);
        } catch (error) {
            console.error('Error viewing event:', error);
        }
    },
};
