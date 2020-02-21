/**
 * Illustrates various ways to invoke functions in JavaScript. These
 * tests are not related to a particular functionality.
 */
describe("Function Invocation", function () {
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
});