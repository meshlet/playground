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

    it('illustrates using proxies to measure performance', function () {
        // Checks whether a number is prime
        function isPrime(value) {
            if (value < 2) {
                return false;
            }

            for (var i = 2; i <= value / 2; ++i) {
                if (value % i === 0) {
                    return false;
                }
            }

            return true;
        }

        // Create the proxy for the isPrime function
        let elapsed_time = -1;
        isPrime = new Proxy(isPrime, {
            // Whenever isPrimeProxy is invoked as a function, the
            // apply property is invoked in turn
            apply: (target, thisArg, argArray) => {
                const start = Date.now();

                // Invoke the target function
                let retval = target.apply(thisArg, argArray);

                elapsed_time = Date.now() - start;
                return retval;
            }
        });

        isPrime(1299827);
        expect(elapsed_time).toBeGreaterThanOrEqual(0);
    });

    it('illustrates autopopulating properties with proxies', function () {
        // A class that models a file system folder
        function Folder() {}

        // Creating a folder hierarchy is a bit tedious, as the following
        // doesn't work
        let root = new Folder();

        // Expect an error as unknown properties are read
        expect(() => {
            root.home.mickey.documents.file = "mickey.txt";
        }).toThrow();

        // Proxies makes it possible to automatically create missing properties.
        function SmartFolder() {
            // The proxy is created on the new SmartFolder instance so that proxy
            // will have access to any properties of SmartFolder instances.
            return new Proxy(this, {
                get: (target, property) => {
                    if (!(property in target)) {
                        // If parent folder (target) doesn't have the specified child
                        // older (property), create it automatically
                        target[property] = new SmartFolder();
                    }

                    // Return the specified child folder
                    return target[property]
                }
            });
        }

        root = new SmartFolder();

        // Creating a folder hierarchy is not simple, as each folder is actually
        // a proxy and read access to a missing sub-folder will automatically
        // create that folder
        expect(() => {
            // Note that 'file' won't be a proxy to a SmartFolder because the value
            // is assigned to it and proxy only has the read trap (get) defined.
            // Hence 'file' will be a property of string type.
            root.home.mickey.documents.file = "mickey.txt";
        }).not.toThrow();
    });

    it('illustrates supporting negative array indices with proxies', function () {
        function createNegativeArrayProxy(array) {
            if (!Array.isArray(array)) {
                throw new TypeError("Expected an array");
            }

            return new Proxy(array, {
                get: (target, index) => {
                    // Use unary + operator to convert index to a number. This is
                    // because array's can be indexed with strings (i.e. array["1"]
                    // is legal)
                    index = +index;

                    return target[index < 0 ? array.length + index : index];
                },
                set: (target, index, value) => {
                    // Use unary + operator to convert index to a number. This is
                    // because array's can be indexed with strings (i.e. array["1"]
                    // is legal)
                    index = +index;

                    target[index < 0 ? array.length + index : index] = value;
                }
            });
        }

        let array = [-3, 4, 10, -9];

        // Built-in arrays can'be indexed using negative indices
        expect(array[-1]).toBeUndefined();
        expect(array[-2]).toBeUndefined();
        expect(array[-3]).toBeUndefined();
        expect(array[-4]).toBeUndefined();

        let negativeArray = createNegativeArrayProxy(array);

        // But our negative array proxy can
        expect(negativeArray[0]).toBe(-3);
        expect(negativeArray[1]).toBe(4);
        expect(negativeArray[2]).toBe(10);
        expect(negativeArray[3]).toBe(-9);
        expect(negativeArray[-1]).toBe(-9);
        expect(negativeArray[-2]).toBe(10);
        expect(negativeArray[-3]).toBe(4);
        expect(negativeArray[-4]).toBe(-3);

        // We can also assign values to array elements using negative indices
        negativeArray[-1] = 55;
        negativeArray[-4] = 0;
        expect(array[3]).toBe(55);
        expect(array[0]).toBe(0);
        expect(negativeArray[-1]).toBe(55);
        expect(negativeArray[-4]).toBe(0);
        expect(negativeArray[3]).toBe(55);
        expect(negativeArray[0]).toBe(0);
    });
});