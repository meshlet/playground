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