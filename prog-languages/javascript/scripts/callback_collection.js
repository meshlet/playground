/**
 * A collection of unique callbacks. Attempting to add
 * an already registered callback function will have no
 * effect.
 */
function CallbackCollection() {
    var callback_cache = [];

    /**
     * Adds a new callback
     *
     * @param callback
     * @returns {boolean}
     */
    this.addCallback = function(callback) {
        if (typeof(callback.id) === "undefined") {
            callback.id = callback_cache.length;
            callback_cache.push(callback);
            return true;
        }
        return false;
    }

    /**
     * Executes registered callbacks
     */
    this.executeCallbacks = function () {
        for (var callback of callback_cache) {
            callback();
        }
    }
}