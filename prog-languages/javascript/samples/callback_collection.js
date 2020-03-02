/**
 * A collection of unique callbacks. Attempting to add
 * an already registered callback function will have no
 * effect.
 */
function CallbackCollection() {
    var callback_cache = [];

    /**
     * Adds a new callback
     *
     * @param callback
     * @returns {boolean}
     */
    this.addCallback = function(callback) {
        if (typeof(callback.id) === "undefined") {
            callback.id = callback_cache.length;
            callback_cache.push(callback);
            return true;
        }
        return false;
    }

    /**
     * Executes registered callbacks
     */
    this.executeCallbacks = function () {
        for (var callback of callback_cache) {
            callback();
        }
    }
}

/**
 * Tests.
 */
describe("Callback Collection", function () {
    it("should contain no duplicates", function () {
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