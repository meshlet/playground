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
function sortDescendingArrayFunction(array) {
    array.sort((value1, value2) => value2 - value1);
}

/**
 * Tests.
 */
describe("Sorting", function () {
    it('sortDescending sorts array in descending order', function () {
        var array = [1, -2, 0, 4, -10, 1, 5, -3];
        sortDescending(array);
        expect(array).toEqual([5, 4, 1, 1, 0, -2, -3, -10]);
    });

    it('sortDescendingArrayFunction sorts array in descending order', function () {
        var array = [1, -2, 0, 4, -10, 1, 5, -3];
        sortDescendingArrayFunction(array);
        expect(array).toEqual([5, 4, 1, 1, 0, -2, -3, -10]);
    });
});