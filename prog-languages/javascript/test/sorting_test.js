/**
 * Tests for sorting.js.
 */
describe("Sorting Tests", function () {
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