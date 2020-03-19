/**
 * Illustrates the JavaScript symbols introduced in ES6.
 */
describe("Symbols", function () {
    it('illustrates uniqueness of symbols', function () {
        const symbol1 = Symbol("abc");
        const symbol2 = Symbol("abc");

        // Every symbol is unique
        expect(symbol1 === symbol2).toBeFalse();
    });

    it('illustrates symbols as primitive types', function () {
        const symbol = Symbol();
        expect(typeof symbol).toEqual("symbol");
    });

    it('illustrates using symbols as property keys', function () {
        // Create a symbol that will be used as a property key
        // and a symbol that will be used as a method key
        const NAME = Symbol();
        const GET_NAME = Symbol();

        // Use symbol as property key after the objects has been created
        const personObj1 = {};
        personObj1[NAME] = "Mickey";
        expect(personObj1[NAME]).toEqual("Mickey");

        // Use computed property syntax to add property whose name is
        // determined by the symbol at object construction time
        const personObj2 = {
            [NAME]: "Tony"
        };
        expect(personObj2[NAME]).toEqual("Tony");

        // Define the Person class that uses symbols to specify property
        // and method names
        class Person {
            [NAME] = "Robert";

            [GET_NAME]() {
                return this[NAME];
            }
        }

        const personObj3 = new Person();
        expect(personObj3[NAME]).toEqual("Robert");
        expect(personObj3[GET_NAME]()).toEqual("Robert");
    });

    it('illustrates enumerating own property keys', function () {
        // A helper that sortes the two input arrays and asserts that
        // they contain the same data. Note that this function won't
        // work for arrays that have multiple symbols with same
        // description
        function compareArrays(array1, array2) {
            function sortCallback(a, b) {
                let aStr = a.toString();
                let bStr = b.toString();

                if (aStr < bStr) {
                    return -1;
                }
                else if (aStr > bStr) {
                    return 1;
                }
                else {
                    return 0;
                }
            }

            array1.sort(sortCallback);
            array2.sort(sortCallback);

            expect(array1).toEqual(array2);
        }
        // Define symbol that will be used to identify the
        // person's name property
        const NAME = Symbol("name");

        // Create a person object with both string-valued and symbol-values
        // properties
        const person = {
            [NAME]: "Mickey",
            surname: "Mouse",
            age: 35
        };

        // Also define one non-enumerable property
        Object.defineProperty(person,"nonEnum", {
            enumerable: false
        });

        // Object.getOwnPropertyNames ignores symbol-valued properties
        compareArrays(Object.getOwnPropertyNames(person), ["surname", "age", "nonEnum"]);

        // Object.getOwnPropertySymbols ignores string-values properties
        compareArrays(Object.getOwnPropertySymbols(person), [NAME]);

        // Reflect.ownKeys considers all kinds of keys
        compareArrays(Reflect.ownKeys(person), [NAME, "surname", "age", "nonEnum"]);

        // Object.keys behaves similarly to Object.getOwnPropertyNames except
        // that it ignores non-enumerable properties
        compareArrays(Object.keys(person), ["surname", "age"]);
    });

    it('illustrates using symbols to define enums', function () {
        // Define several enums whose values are strings. We're only defining
        // these with the `let` instead of `const` so that we can reassign
        // them to symbols later on. In actual code they need to be constant
        let RED = "RED";
        let GREEN = "GREEN";
        let BLUE = "BLUE";

        // The following function will return CSS-like rgb string for the
        // given color enum and will throw an error if unknown color enum
        // is passed in
        function colorToRgb(color) {
            switch (color) {
                case RED:
                    return "rgb(255, 0, 0)";
                case GREEN:
                    return "rgb(0, 255, 0)";
                case BLUE:
                    return "rgb(0, 0, 255)";
                default:
                    throw new Error("unknown color");
            }
        }

        // The problem with using strings to defined enums is that strings
        // are not unique. Hence, if someone passes a string that itself is
        // not a color but matches the value of one of the colors the function
        // will happily accept it instead of throwing an error
        expect(colorToRgb("RED")).toEqual("rgb(255, 0, 0)");

        // This can be solved with symbols. Each symbol instance is unique
        // hence no other symbol can have the same value
        RED = Symbol("red");
        GREEN = Symbol("green");
        BLUE = Symbol("blue");

        // Note that we don't have to modify the colorToRgb function at all.
        // It will work just fine with symbols
        expect(colorToRgb(GREEN)).toEqual("rgb(0, 255, 0)");

        // However, passing a symbol that isn't one of the defined color
        // enum values will make it throw an exception
        expect(() => {
            // The fact that description matches that of the RED color enum
            // makes no difference - the symbol is still different
            colorToRgb(Symbol("red"));
        }).toThrow();
    });

    it('illustrates using symbols keys of internal properties', function () {
        // The following symbol will be the key of a PASSWORD property
        const PASSWORD = Symbol("password");

        // The following class uses the PASSWORD symbol to define
        // the internal password property. Note that this doesn't
        // actually hide the property, but it does ensure that it
        // can't clash with other property names (potentially added
        // to the object) and also makes it harder to access the
        // property (have to use the square brackets notation)
        class Account {
            constructor(username, password) {
                this.username = username;
                this[PASSWORD] = password;
            }

            hasPassword(password) {
                return this[PASSWORD] === password;
            }
        }

        const account = new Account("mickey.mouse", "p@ssword");
        expect(account.hasPassword("password")).toBeFalse();
        expect(account.hasPassword("p@ssword")).toBeTrue();
    });

    it('illustrates using symbols as keys of meta-level properties', function () {
        // In ES6, an object is iterable if it contains a method
        // whose key is Symbol.iterator. Using symbols for such
        // meta-level properties makes it impossible to mistaken
        // a normal method for a customization method.
        // The following object is made iterable by implementing
        // a method whose key is Symbol.iterator.
        const iterableObj = {
            data: ["A", "B", "C", "D"],

            // Note that `Symbol.iterator` is a generator function
            *[Symbol.iterator]() {
                for (let value of this.data) {
                    yield value;
                }
            }
        };

        // Iterate over the iterableObj using the for-of loop
        let i = 0;
        for (let value of iterableObj) {
            expect(value).toEqual(iterableObj.data[i++]);
        }
    });

    it('illustrates code realms and built-in symbols', function () {
        // Create an iframe element
        const iframe = document.createElement("iframe");

        // The JavaScript in its srcdoc property invokes a global function
        // from the parent of iframe's window object, which in this case
        // is the global function of the main page's window object
        iframe.srcdoc = "<script> window.parent.testFun() </script>";
        document.body.appendChild(iframe);

        // Executing iframe's global code is done in a different iteration
        // of the event-loop. Hence, we need to tell Jasmine framework to
        // wait for until `testFun` is invoked
        return new Promise(resolve => {
            // Define a global function that will be invoked from the iframe's
            // code
            window.testFun = () => {
                // Get the reference to the frame that's origin of the call to
                // `testFun`
                let srcIframe = frames[frames.length - 1];

                // The built-in symbols are shared across all realms. This is
                // enforced by the JavaScript engine. Making sure that user-defined
                // symbols are shared across realms involves a bit of work. See
                // next sample
                expect(Symbol.iterator).toBe(srcIframe.Symbol.iterator);

                // Resolve the promise
                resolve();
            };
        });
    });

    /**
     * Sharing user-defines symbols across code realms can be achieved
     * using the global symbol registry. Symbol.for method can be used
     * to query for the symbol with given name. If such global symbol
     * exists it is returned, otherwise the global symbols is created
     * first.
     */
    it('illustrates code realms and user-defined symbols', function () {
        // Create an iframe element
        const iframe = document.createElement("iframe");

        // The iframe's srcdoc contains a script that creates a symbol in
        // the global symbol registry and then passes it to the global
        // function of the iframe window's parent (which is the global
        // function of the page's window object)
        iframe.srcdoc =
            "<script>" +
            "  const globalSymbol = Symbol.for('global');" +
            "  window.parent.testFun(globalSymbol);" +
            "</script>";

        document.body.appendChild(iframe);

        // Executing iframe's global code is done in a different iteration
        // of the event-loop. Hence, we need to tell Jasmine framework to
        // wait for until `testFun` is invoked
        return new Promise(resolve => {
            // Define a global function that will be invoked from the iframe's
            // code
            window.testFun = (symbol) => {
                // Obtain the reference to the `global` symbol
                let globalSymbol = Symbol.for("global");

                // Assert that the two variables reference the same symbol. In
                // other words, symbol is shared between two realms
                expect(symbol).toBe(globalSymbol);

                // Symbol.keyFor can be used to get the name of the global symbol
                expect(Symbol.keyFor(symbol)).toEqual("global");

                // Note that built-in global symbols such as Symbol.iterate are
                // not in the global registry
                expect(Symbol.keyFor(Symbol.iterator)).toBeUndefined();
                // Resolve the promise
                resolve();
            };
        });
    });

    it('illustrates invoking Symbol as constructor', function () {
        // Invoking Symbol as a constructor is not allowed and error
        // is thrown if attempted
        expect(() => {
            new Symbol();
        }).toThrowError(TypeError);
    });

    it('illustrates casting symbols to strings', function () {
        // Implicit casting of symbols to string is not allowed and
        // exception is thrown if attempted
        expect(() => {
            return "ABC" + Symbol("A");
        }).toThrowError(TypeError);

        // Symbols can be explicitly converted to strings using
        // Symbol.toString method
        expect(Symbol("sym").toString()).toEqual("Symbol(sym)");
    });
});