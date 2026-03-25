/**
 * Main App - Initialize and manage pages
 */

const App = {
    currentPage: 'dashboard',
    refreshInterval: null,
    isAutoRefreshing: true,

    init() {
        console.log('🤖 Aura AI Dashboard Initializing...');
        
        this.setupNavigation();
        this.setupControlButtons();
        this.startHealthCheck();
        this.startAutoRefresh();
        this.loadInitialPage();

        console.log('✅ Dashboard Ready');
    },

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageName = link.dataset.page;
                this.navigateTo(pageName);
            });
        });
    },

    navigateTo(pageName) {
        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const pageId = `${pageName}-page`;
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
        }

        // Update title
        const titleMap = {
            'dashboard': 'Dashboard',
            'failures': 'Pipeline Failures',
            'events': 'Events Log',
            'agents': 'Agent Management',
            'settings': 'Settings',
        };
        document.getElementById('page-title').textContent = titleMap[pageName] || 'Dashboard';

        // Load page content
        this.loadPage(pageName);
        this.currentPage = pageName;

        // Scroll to top
        window.scrollTo(0, 0);
    },

    loadPage(pageName) {
        const pageLoaders = {
            'dashboard': () => Dashboard.load(),
            'failures': () => Failures.load(),
            'events': () => Events.load(),
            'agents': () => Agents.load(),
            'settings': () => Settings.load(),
        };

        if (pageLoaders[pageName]) {
            pageLoaders[pageName]().catch(error => {
                console.error(`Error loading ${pageName}:`, error);
            });
        }
    },

    loadInitialPage() {
        // Check URL hash for page
        const hash = window.location.hash.substring(1);
        const initialPage = ['dashboard', 'failures', 'events', 'agents', 'settings'].includes(hash) 
            ? hash 
            : 'dashboard';
        
        this.navigateTo(initialPage);
    },

    setupControlButtons() {
        // Trigger test failure
        document.getElementById('trigger-test-btn')?.addEventListener('click', async () => {
            const btn = event.target;
            btn.disabled = true;
            btn.textContent = '⏳ Triggering...';

            try {
                await API.triggerTestFailure();
                btn.textContent = '✓ Test Triggered!';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = '🧪 Trigger Test Failure';
                    Dashboard.load();
                }, 2000);
            } catch (error) {
                console.error('Error triggering test:', error);
                btn.textContent = '❌ Error';
                btn.disabled = false;
            }
        });

        // Refresh button
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.refreshCurrentPage();
        });
    },

    refreshCurrentPage() {
        this.loadPage(this.currentPage);
    },

    startHealthCheck() {
        setInterval(async () => {
            const isOnline = await API.checkHealth();
            const statusDot = document.getElementById('backend-status');
            const statusText = document.getElementById('backend-text');

            if (isOnline) {
                statusDot.className = 'status-dot online';
                statusText.textContent = 'Online';
            } else {
                statusDot.className = 'status-dot offline';
                statusText.textContent = 'Offline';
            }
        }, 5000);
    },

    startAutoRefresh() {
        setInterval(() => {
            if (this.isAutoRefreshing) {
                this.refreshCurrentPage();
            }
        }, 3000);
    },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (['dashboard', 'failures', 'events', 'agents', 'settings'].includes(hash)) {
        App.navigateTo(hash);
    }
});
