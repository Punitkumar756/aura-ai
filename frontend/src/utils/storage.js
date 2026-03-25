/**
 * Local Storage Utilities
 */

const Storage = {
    /**
     * Get value from localStorage
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    /**
     * Set value in localStorage
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Remove value from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Settings Manager
     */
    settings: {
        get(key, defaultValue) {
            const settings = Storage.get('aura_settings', {});
            return settings[key] !== undefined ? settings[key] : defaultValue;
        },

        set(key, value) {
            const settings = Storage.get('aura_settings', {});
            settings[key] = value;
            return Storage.set('aura_settings', settings);
        },

        getAll() {
            return Storage.get('aura_settings', {});
        },

        setAll(obj) {
            return Storage.set('aura_settings', obj);
        },
    },
};
