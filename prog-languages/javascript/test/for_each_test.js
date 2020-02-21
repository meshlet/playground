/**
 * Tests for for_each.js.
 */
describe('ForEach Function Tests', function () {
    it('tests forEach function', function () {
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
});