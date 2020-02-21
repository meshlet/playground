/**
 * Illustrates various types of JavaScript functions. These
 * tests are not related to a particular functionality.
 */
describe("Function Types", function () {
    it('illustrates function constructors', function () {
        var add = new Function("a", "b", "return a + b");
        expect(add(5, 9)).toEqual(14);
    });

    it('illustrates function declarations', function () {
        function fun(a) {
            return a;
        }

        expect(fun(5)).toBe(5);
    });

    it('illustrates method functions', function () {
        var obj = {
            method: function (a) {
                return a
            }
        };

        expect(obj.method(5)).toBe(5);
    });

    it('illustrates function expressions', function () {
        var fun_expr = function (a) {
            return a;
        };

        expect(fun_expr(5)).toBe(5);
    });

    it('illustrates arrow functions', function () {
        var arrow_fun1 = a => a;
        var arrow_fun2 = (a, b) => a + b;
        var arrow_fun3 = () => 4;
        var arrow_fun4 = a => {
            var b = 2 * a;
            return b;
        };

        expect(arrow_fun1(5)).toBe(5);
        expect(arrow_fun2(4, 5)).toBe(9);
        expect(arrow_fun3()).toBe(4);
        expect(arrow_fun4(5)).toBe(10);
    });

    it('illustrates immediately invoked function expressions (IIFE)', function () {
        expect((function (a, b) {
            return a * b;
        })(3, 9)).toEqual(27);

        expect((function (a, b) {
            return a * b;
        }(3, 9))).toEqual(27);

        // The unary operator in the beginning is just a way to differentiate
        // function expression from the function declaration. Note, however,
        // that this form cannot be used if the function returns the value
        // that will be consumed by the calling code.
        expect(+function (a, b) { return a * b; }(3, 9)).toEqual(27);
        expect(-function (a, b) { return a * b; }(3, 9)).toEqual(-27);
        expect(!function (a, b) { return a * b; }(3, 9)).toEqual(!27);
        expect(~function (a, b) { return a * b; }(3, 9)).toEqual(~27);
    });
});