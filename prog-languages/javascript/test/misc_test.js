/**
 * These tests exercise various JavaScript features. They are not
 * testing any particular functionality.
 */
describe("MiscellaneousTests", function() {
    it('illustrates function constructors', function () {
        var add = new Function("a", "b", "return a + b");
        expect(add(5, 9)).toEqual(14);
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

    it('illustrates rest parameters', function () {
        function fnWithRestParameters(first, ...other_params) {
            return other_params;
        }

        expect(fnWithRestParameters(-4, 3, 0, 1, 2, -5, 9)).toEqual([3, 0, 1, 2, -5, 9]);
    });

    it('illustrates default parameters', function () {
        function fnWithDefaultParameters(a, b = 5, c = a * b) {
            return [a, b, c];
        }

        expect(fnWithDefaultParameters(1, 2, 3)).toEqual([1, 2, 3]);
        expect(fnWithDefaultParameters(4, 7)).toEqual([4, 7, 28]);
        expect(fnWithDefaultParameters(7)).toEqual([7, 5, 35]);
    });

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

    it('illustrates how use strict disables arguments aliasing', function () {
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

    it('illustrates invocation as a function', function () {
        function fn() {
            return this;
        }
        
        function fnStrict() {
            "use strict"
            return this;
        }

        expect(fn()).toEqual(window);
        expect(fnStrict()).toEqual(undefined);
    });

    it('illustrates invocation as a method', function () {
        function fn() {
            return this;
        }

        var obj1 = {
            method: fn
        };

        var obj2 = {
            method: fn
        };

        expect(obj1.method()).toBe(obj1);
        expect(obj2.method()).toBe(obj2);
    });

    it('illustrates invocation as a constructor', function () {
        function Constructor1() {
            this.fn = function () {
                return this;
            };

            // Returning a primitive (a non-object) is ignored if function is
            // invoked as a constructor
            return 1;
        }

        expect(Constructor1()).toBe(1);
        var obj1 = new Constructor1();
        expect(typeof(obj1)).toEqual("object");
        expect(obj1.fn()).toBe(obj1);

        function Constructor2() {
            this.fn = {
                flag: false
            };

            // Returning an object will override the normal 'new' operator behavior.
            // The 'this' object is discarded, and the object that appears in the
            // 'return' statement is returned by the 'new' operator.
            return {
                flag: true
            };
        }

        var obj2 = new Constructor2();
        expect(obj2.flag).toBeTrue();
    });

    it('illustrates usage of Function.apply and Function.call methods', function () {
        function fn(a, b) {
            this.result = a + b;
        }

        var obj1 = {};
        var obj2 = {};

        fn.apply(obj1, [3, 5]);
        expect(obj1.result).toEqual(8);

        fn.call(obj2, 5, 9);
        expect(obj2.result).toEqual(14);
    });

    it('illustrates the context inheritance in arrow functions', function () {
        function Constructor1() {
            this.method = function () {
                return this;
            };
        }
        var obj1 = new Constructor1();
        var obj2 = {
            method: obj1.method
        };
        // Calling 'method' via obj2 will set 'this' parameter to obj2
        expect(obj2.method()).toBe(obj2);

        function Constructor2() {
            this.method = () => this;
        }
        obj1 = new Constructor2();
        obj2 = {
            method: obj1.method
        };
        // Calling 'method' via obj2 won't change 'this' parameter. As arrow
        // functions don't have the implicit 'this' parameter, the arrow
        // function defined in Constructor2 captures the 'this' from the
        // Constructor2 which is the newly created object (in this case obj1).
        expect(obj2.method()).toBe(obj1);
    });

    it('illustrates how to bind context to a function via Function.bind method', function () {
        function fn() {
            return this;
        }

        var context = { a: 5 };
        var fnWithBoundContext = fn.bind(context);

        // The context doesn't change when we call it as a function
        expect(fnWithBoundContext()).toBe(context);

        // The context doesn't change when we call it as a method
        var obj1 = {
            method: fnWithBoundContext
        };
        expect(obj1.method()).toBe(context);

        // We can also re-bind the context of the method function
        function Constructor1() {
            this.method = function () {
                return this;
            };
        }
        obj1 = new Constructor1();
        expect(obj1.method()).toBe(obj1);
        var obj2 = {};
        var methodReturnedByBind = obj1.method.bind(obj2);
        obj2['method'] = methodReturnedByBind;
        expect(obj2.method()).toBe(obj2);

        // Re-binding the context won't work with arrow functions because
        // they don't have the implicit 'this' parameter. Bind will basically
        // have no effect on the 'this' captured by the arrow function.
        function Constructor2() {
            this.method = () => this;
        }
        obj1 = new Constructor2();
        expect(obj1.method()).toBe(obj1);
        obj2 = {};
        methodReturnedByBind = obj1.method.bind(obj2);
        obj2['method'] = methodReturnedByBind;
        expect(obj2.method()).toBe(obj1);
    });

    it('illustrates how to mimic private variables using closures', function () {
        function Constructor() {
            var counter = 0;

            this.increment = function () {
                ++counter;
            };

            this.getValue = function () {
                return counter;
            };
        }

        var obj1 = new Constructor();
        // Can't access the private member directly
        expect(obj1.counter).toBe(undefined);
        expect(obj1.getValue()).toBe(0);
        obj1.increment();
        expect(obj1.getValue()).toBe(1);

        var obj2 = new Constructor();
        // Different instance gets its own counter
        expect(obj2.getValue()).toBe(0);
    });
});