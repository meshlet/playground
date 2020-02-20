/**
 * Contains tests for functionality implemented by misc.js.
 */
describe("MiscellaneousTests", function() {
    it("sortDescending sorts array in descending order", function() {
        var array = [1, -2, 0, 4, -10, 1, 5, -3];
        sortDescending(array);
        expect(array).toEqual([5, 4, 1, 1, 0, -2, -3, -10]);
    });

    it('sortDescendingArrayCallback sorts array in descending order', function () {
        var array = [1, -2, 0, 4, -10, 1, 5, -3];
        sortDescendingArrayCallback(array);
        expect(array).toEqual([5, 4, 1, 1, 0, -2, -3, -10]);
    });

    it("callback collection has no duplicates", function () {
        var counter = 0;
        function f1() {
            ++counter;
        }
        function f2() {
            ++counter;
        }
        function f3() {
            ++counter;
        }

        var callback_collection = new CallbackCollection();
        expect(callback_collection.addCallback(f1)).toBeTrue();
        expect(callback_collection.addCallback(f2)).toBeTrue();
        expect(callback_collection.addCallback(f3)).toBeTrue();

        // Add the same set of callbacks
        expect(callback_collection.addCallback(f1)).toBeFalse();
        expect(callback_collection.addCallback(f2)).toBeFalse();
        expect(callback_collection.addCallback(f3)).toBeFalse();

        // Execute the callbacks and assert that the counter has
        // expected value
        callback_collection.executeCallbacks();
        expect(counter).toEqual(3);
    });

    it("prime computation works correctly", function () {
        var test_vectors = [
            { value: 1,  is_prime: false },
            { value: 0,  is_prime: false },
            { value: 2,  is_prime: true  },
            { value: 7,  is_prime: true  },
            { value: 10, is_prime: false },
            { value: 21, is_prime: false },
            { value: 19, is_prime: true  },
            { value: 10, is_prime: false },
            { value: 2,  is_prime: true  },
        ];

        for (var test_vector of test_vectors) {
            expect(isPrimeWithMemoization(test_vector.value)).toBe(test_vector.is_prime);
        }
    });

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
});