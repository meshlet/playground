/**
 * Illustrates the 'arguments' parameter implicitly setup at each
 * function invocation.
 */
describe("Arguments Parameter", function () {
    it('uses arguments parameter to sum all function arguments', function () {
        function sumVariadicArgumentsParam() {
            var sum = 0;
            for (var i = 0; i < arguments.length; ++i) {
                sum += arguments[i];
            }
            return sum;
        }

        expect(sumVariadicArgumentsParam(4, 5, 1)).toEqual(10);
        expect(sumVariadicArgumentsParam(7, -5, 10, -11, -1)).toEqual(0);
    });

    it('illustrates how arguments parameter aliases function parameters', function () {
        (function (a, b) {
            expect(a).toBe(2);
            expect(b).toBe(5);
            expect(arguments[0]).toBe(2);
            expect(arguments[1]).toBe(5);

            arguments[0] = 70;
            arguments[1] = 10;
            expect(a).toBe(70);
            expect(b).toBe(10);

            a = 6;
            b = 90;
            expect(arguments[0]).toBe(6);
            expect(arguments[1]).toBe(90);
        })(2, 5);
    });

    it('illustrates how using strict mode disables arguments aliasing', function () {
        (function (a, b) {
            "use strict"

            expect(a).toBe(1);
            expect(b).toBe(2);
            expect(arguments[0]).toBe(1);
            expect(arguments[1]).toBe(2);

            arguments[0] = 70;
            arguments[1] = 10;
            expect(a).toBe(1);
            expect(b).toBe(2);

            a = 6;
            b = 90;
            expect(arguments[0]).toBe(70);
            expect(arguments[1]).toBe(10);
        })(1, 2);
    });
});