/**
 * Illustrates the default parameters (parameters with a default value).
 * These tests are not related to a particular functionality.
 */
describe("Default Parameters", function () {
    it('illustrates default parameters', function () {
        function fnWithDefaultParameters(a, b = 5, c = a * b) {
            return [a, b, c];
        }

        expect(fnWithDefaultParameters(1, 2, 3)).toEqual([1, 2, 3]);
        expect(fnWithDefaultParameters(4, 7)).toEqual([4, 7, 28]);
        expect(fnWithDefaultParameters(7)).toEqual([7, 5, 35]);
    });
});