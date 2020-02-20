/**
 * Contains miscellaneous JavaScript samples.
 */

/**
 * Sorts the array in descending order.
 *
 * @param array
 */
function sortDescending(array) {
    array.sort(function (value1, value2) {
        return value2 - value1;
    });
}

/**
 * Sorts the array in descending order using an array
 * function to order the elements.
 *
 * @param array
 */
function sortDescendingArrayCallback(array) {
    array.sort((value1, value2) => value2 - value1);
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

/**
 * Sums all its arguments by iterating over the 'arguments' parameter.
 *
 * @returns {number}
 */
function sumVariadicArgumentsParam() {
    var sum = 0;
    for (var i = 0; i < arguments.length; ++i) {
        sum += arguments[i];
    }
    return sum;
}

/**
 * Sums all its arguments by iterating over the rest parameter array.
 *
 * @param args
 * @returns {number}
 */
function sumVariadicRestParam(...args) {
    var sum = 0;
    for (var arg of args) {
        sum += arg;
    }
    return sum;
}

/**
 * Similar to the Array.forEach but also allows the user to
 * stop iteration by returning 'true' from the callback.
 *
 * @param array     The array to iterate over.
 * @param callback  The function to invoke for each array element. The
 *                  callback is invoked with:
 *                  callback(array[index], index, array) where index is
 *                  the index of the current array element. Callback
 *                  context is set according to the value of thisArg.
 * @param thisArg   The value to use as 'this' when executing callback.
 *                  This parameter is optional. If unspecified, the
 *                  callback context will be set to undefined.
 */
function forEach(array, callback, thisArg) {
    if (!Array.isArray(array)) {
        throw TypeError("'array' is not a JavaScript array");
    }
    if (typeof(callback) != "function") {
        throw TypeError("'callback' is not a JavaScript function");
    }

    for (var i = 0; i < array.length; ++i) {
        if (callback.call(thisArg, array[i], i, array)) {
            break;
        }
    }
}