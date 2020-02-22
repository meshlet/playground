/**
 * Illustrates JavaScript rest parameters introduced in ES6.
 */
describe("Rest Parameters", function () {
    it('illustrates rest parameters', function () {
        function fnWithRestParameters(first, ...other_params) {
            return other_params;
        }

        expect(fnWithRestParameters(-4, 3, 0, 1, 2, -5, 9)).toEqual([3, 0, 1, 2, -5, 9]);
    });

    it('uses rest parameter to sum all function arguments', function () {
        function sumVariadicRestParam(...args) {
            var sum = 0;
            for (var arg of args) {
                sum += arg;
            }
            return sum;
        }

        expect(sumVariadicRestParam(4, 5, 1)).toEqual(10);
        expect(sumVariadicRestParam(7, -5, 10, -11, -1)).toEqual(0);
    });
});