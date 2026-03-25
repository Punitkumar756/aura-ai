/**
 * Settings Page
 */

const Settings = {
    load() {
        this.loadSettings();
        this.setupEventListeners();
    },

    loadSettings() {
        const settings = Storage.settings.getAll();
        document.getElementById('api-endpoint').value = settings.apiEndpoint || 'http://localhost:8000';
        document.getElementById('refresh-interval').value = settings.refreshInterval || 3;
        document.getElementById('auto-refresh').checked = settings.autoRefresh !== false;
    },

    setupEventListeners() {
        document.querySelector('.btn-primary', document.getElementById('settings-page'))?.addEventListener('click', () => {
            this.saveSettings();
        });
    },

    saveSettings() {
        const apiEndpoint = document.getElementById('api-endpoint').value;
        const refreshInterval = parseInt(document.getElementById('refresh-interval').value);
        const autoRefresh = document.getElementById('auto-refresh').checked;

        Storage.settings.setAll({
            apiEndpoint,
            refreshInterval,
            autoRefresh,
        });

        // Update API base URL
        API.baseURL = apiEndpoint;

        alert('Settings saved successfully!');
    },
};
