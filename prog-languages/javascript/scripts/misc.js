/**
 * Contains miscellaneous JavaScript samples.
 */

/**
 * Sorts the array in descending order.
 */
function sortDescending(array) {
    array.sort(function (value1, value2) {
        return value2 - value1;
    });
}

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

/**
 * Checks whether a number is prime and caches the results
 * so that future calls for the same numbers can return
 * the memoized value.
 *
 * @param value
 * @returns {boolean|*}
 */
function isPrimeWithMemoization(value) {
    if (!isPrimeWithMemoization.cache) {
        isPrimeWithMemoization.cache = {};
    }

    if (typeof(isPrimeWithMemoization.cache[value]) !== "undefined") {
        return isPrimeWithMemoization.cache[value];
    }

    var is_prime = value > 1;
    for (var i = 2; i <= value / 2; ++i) {
        if (value % i === 0) {
            is_prime = false;
            break;
        }
    }

    return isPrimeWithMemoization.cache[value] = is_prime;
}