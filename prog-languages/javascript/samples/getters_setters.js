/**
 * Illustrates JavaScript getters/setters introduced in ES5
 * and extended to classes in ES6.
 */
describe("Getters/Setters", function () {
    it('illustrates defining getters/setters on object literals', function () {
        let obj = {
            name: "Mickey",
            surname: "Mouse",
            get fullName() {
                return this.name + " " + this.surname;
            },
            set fullName(value) {
                [this.name, this.surname] = value.split(" ");
            }
        };

        expect(obj.fullName).toEqual("Mickey Mouse");
        obj.fullName = "Tony Stark";
        expect(obj.fullName).toEqual("Tony Stark");
    });

    it('illustrates using getters/setters with ES6 classes', function () {
        class Person {
            constructor() {
                this.name = "Mickey";
                this.surname = "Mouse";
            }

            get fullName() {
                return this.name + " " + this.surname;
            }

            set fullName(value) {
                [this.name, this.surname] = value.split(" ");
            }
        }

        let person = new Person();
        expect(person.fullName).toEqual("Mickey Mouse");
        person.fullName = "Tony Stark";
        expect(person.fullName).toEqual("Tony Stark");
    });

    /**
     * If we want to simulate private members while also having custom
     * getters/setters, we must use Object.defineProperty (or Object.defineProperties)
     * to define accessors on 'this' object. This is the only way for the getter/setter
     * property to capture the local (private) variables in its closure.
     */
    it('illustrates defining getters/setters with Object.defineProperty', function () {
        function Person() {
            // Define few private member variables
            let name = "Mickey";
            let surname = "Mouse";

            // Define the accessor property fullName. Note that this property is
            // defined in the same scope as the variables defined above, thus
            // getter/setter method can capture those variables in its closure.
            Object.defineProperty(this, "fullName", {
                get() {
                    return name + " " + surname;
                },
                set(v) {
                    [name, surname] = v.split(" ");
                }
            });
        }

        let person = new Person();
        expect(person.name).toBeUndefined();
        expect(person.surname).toBeUndefined();
        expect(person.fullName).toEqual("Mickey Mouse");
        person.fullName = "Tony Stark";
        expect(person.fullName).toEqual("Tony Stark");
    });

    it('illustrates read-only accessor property (without setter)', function () {
        (function() {
            let obj = {
                name: "Mickey",
                surname: "Mouse",
                get fullName() {
                    return this.name + " " + this.surname;
                }
            };

            // Assigning a value to the accessor property without a setter has
            // no effect
            obj.fullName = "Tony Stark";
            expect(obj.fullName).toEqual("Mickey Mouse");
        })();

        (function() {
            'use strict';

            let obj = {
                name: "Mickey",
                surname: "Mouse",
                get fullName() {
                    return this.name + " " + this.surname;
                }
            };

            // Assigning a value to the accessor property without a setter throws
            // an error in strict mode.
            expect(() => {
                obj.fullName = "Tony Stark";
            }).toThrowError(TypeError);
        })();
    });
});