/**
 * Formatting Utilities
 */

const Formatters = {
    /**
     * Format time as "X minutes ago"
     */
    timeAgo(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    },

    /**
     * Format confidence as percentage
     */
    confidence(value) {
        return `${Math.round(value * 100)}%`;
    },

    /**
     * Format status with color indicator
     */
    statusBadge(status) {
        const badges = {
            'resolved': { text: 'Resolved', class: 'badge-success' },
            'pending': { text: 'Pending', class: 'badge-warning' },
            'failed': { text: 'Failed', class: 'badge-danger' },
            'completed': { text: 'Completed', class: 'badge-success' },
            'in-progress': { text: 'In Progress', class: 'badge-info' },
            'ACTIVE': { text: 'Active', class: 'status-active' },
            'IDLE': { text: 'Idle', class: 'status-idle' },
            'ERROR': { text: 'Error', class: 'status-error' },
        };
        return badges[status] || { text: status, class: 'badge-info' };
    },

    /**
     * Format error type
     */
    errorType(type) {
        const types = {
            'TEST_FAILURE': '❌ Test Failure',
            'LINT_ERROR': '⚠️ Lint Error',
            'IMPORT_ERROR': '📦 Import Error',
            'SYNTAX_ERROR': '🔴 Syntax Error',
            'DEPENDENCY_ERROR': '⛓️ Dependency Error',
            'CONFIG_ERROR': '⚙️ Config Error',
            'UNKNOWN': '❓ Unknown',
        };
        return types[type] || type;
    },

    /**
     * Format event type
     */
    eventType(type) {
        const types = {
            'PIPELINE_FAILED': '🔴 Pipeline Failed',
            'MR_OPENED': '✅ MR Opened',
            'SECURITY_SCAN_COMPLETE': '🔐 Security Scan',
            'DEPLOYMENT_FAILED': '❌ Deployment Failed',
            'SECURITY_SCAN': '🔐 Security Scan',
        };
        return types[type] || type;
    },

    /**
     * Format JSON with syntax highlighting
     */
    json(obj) {
        return JSON.stringify(obj, null, 2);
    },

    /**
     * Truncate string
     */
    truncate(str, length = 100) {
        if (!str) return '';
        if (str.length > length) return str.substring(0, length) + '...';
        return str;
    },

    /**
     * Format timestamp
     */
    timestamp(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString();
    },

    /**
     * Format bytes
     */
    bytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
};
