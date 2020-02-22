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

/**
 * Tests forEach implementation.
 */
describe('ForEach', function () {
    it('forEeach correctly iterates over an array', function () {
        var result = 0;
        forEach([1, 4, -1, 5, 2, 10], function (currentValue) {
            result += currentValue;
        });
        expect(result).toBe(21);

        result = 0;
        forEach([1, 4, 9, 0, -10, 7, -3], function (currentValue, index, array) {
            result += array[index];
        });
        expect(result).toBe(8);

        var obj = {
            result: 0
        };
        forEach([0, 9, -5, 10, 7, -4], function (currentValue) {
            this.result += currentValue;
        }, obj);
        expect(obj.result).toBe(17);

        result = 0;
        forEach([0, 8, 10, -10, 5, 4], function (currentValue, index) {
            if (index > 2) {
                // We want to sum first 3 elements only
                return true;
            }

            result += currentValue;
        });
        expect(result).toBe(18);
    });

    it('should throw TypeError if passed a non-array', function () {
        expect(forEach.bind(undefined, {}, () => {})).toThrowError(TypeError);
        expect(forEach.bind(undefined, "ABC", () => {})).toThrowError(TypeError);
        expect(forEach.bind(undefined, undefined, () => {})).toThrowError(TypeError);
    });

    it('should throw TypeError if passed a non-function', function () {
        expect(forEach.bind(undefined, [1, 2], [])).toThrowError(TypeError);
        expect(forEach.bind(undefined, [1, 2], {})).toThrowError(TypeError);
        expect(forEach.bind(undefined, [1, 2], "ABC")).toThrowError(TypeError);
        expect(forEach.bind(undefined, [1, 2], { method: () => {}})).toThrowError(TypeError);
    });
});