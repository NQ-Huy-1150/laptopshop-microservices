const cache = new Map();

export const productCache = {
    get(id) {
        return cache.get(String(id));
    },

    set(id, value) {
        cache.set(String(id), value);
    },

    has(id) {
        return cache.has(String(id));
    },

    remove(id) {
        cache.delete(String(id));
    },

    clear() {
        cache.clear();
    }
};