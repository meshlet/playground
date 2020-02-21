/**
 * Tests for the callback_collection.js.
 */
describe("Callback Collection Tests", function () {
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
});