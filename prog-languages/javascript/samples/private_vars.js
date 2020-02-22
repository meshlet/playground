/**
 * Illustrates how to mimic private variables from OOP languages
 * with JavaScript closures.
 */
describe("Private Variables", function () {
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

        // However, nothing stops us from assigning the 'increment' or 'getValue'
        // method to a different object:
        var obj3 = {
            increment: obj1.increment,
            getValue: obj1.getValue
        };
        // The illusion of having private variable breaks, as we can access and
        // modify the private variables of obj1 via obj3:
        obj3.increment();
        expect(obj3.getValue()).toBe(2);
        expect(obj1.getValue()).toBe(2);
    });
});