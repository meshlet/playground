/**
 * Illustrates Proxies introduced in ES6.
 */
describe("Proxies", function () {
    it('illustrates creating proxies', function () {
        let person = {
            name: "Mickey",
            surname: "Mouse"
        };

        // Create a proxy for the person object
        let person_proxy = new Proxy(person, {
            // Trap on any property read
            get: (target, property) => {
                // If the property doesn't exist, throw an error
                if (!(property in target)) {
                    throw new TypeError("Person has no '" + property + "' property");
                }

                return target[property];
            },

            // Trap on any property write
            set: (target, property, value) => {
                target[property] = value;
            }
        });

        // 'name' property can be accessed via person instance as well as via the
        // person proxy
        expect(person.name).toEqual("Mickey");
        expect(person_proxy.name).toEqual("Mickey");

        // Accessing non-existing property via the person instance returns
        // undefined while doing the same on the person proxy invokes the
        // 'get' trap (which in this case will throw an error)
        expect(person.age).toBeUndefined();
        expect(() => {
            person_proxy.age
        }).toThrowError(TypeError);

        // Adding a new property to the proxy automatically adds the same
        // property to the target object
        person_proxy.age = 25;
        expect(person.age).toBe(25);
        expect(person_proxy.age).toBe(25);
    });

    it('illustrates using proxies to simplify logging', function () {
        let logs = [];

        // Takes an object and returns its proxy that has logging enabled
        // for all read/write accesses to its properties.
        function makeLoggable(object) {
            return new Proxy(object, {
                get: (target, property) => {
                    logs.push("reading " + property + "");
                    return target[property];
                },
                set: (target, property, value) => {
                    logs.push("writing " + value + " to " + property);
                    target[property] = value;
                }
            });
        }

        let person = {
            name: "Mickey",
            surname: "Mouse"
        };

        person = makeLoggable(person);
        expect(person.name).toEqual("Mickey");
        person.surname = "Stark";
        expect(logs).toEqual(["reading name", "writing Stark to surname"]);
    });
});