/**
 * Algorithms that use memoization to save the computation results
 * and speed up execution on repeated calls with same arguments.
 */

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