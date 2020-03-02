/**
 * Illustrates how to configure object properties with Object.defineProperty
 * and Object.defineProperties.
 */
describe("Configure Object Properties", function () {
    it('illustrates the default values of property descriptor created with assignment', function () {
        let obj = {};

        // Create a new property using assignment
        obj.prop = "ABC";

        // The property descriptor of a property created with assignment
        // is configurable, enumerable, writable, has value set to "ABC"
        // (or whatever value is assigned to the property) and get/set
        // accessors are undefined.
        let prop_descriptor = Object.getOwnPropertyDescriptor(obj, "prop");
        expect(prop_descriptor.configurable).toBeTrue();
        expect(prop_descriptor.enumerable).toBeTrue();
        expect(prop_descriptor.value).toEqual("ABC");
        expect(prop_descriptor.writable).toBeTrue();
        expect(prop_descriptor.get).toBeUndefined();
        expect(prop_descriptor.set).toBeUndefined();
    });

    it('illustrates that property descriptor properties are not writable', function () {
        let obj = {};
        obj.prop = "ABCD";

        // Attempt to change value and configurable properties of the property
        // descriptor directly
        Object.getOwnPropertyDescriptor(obj, "prop").value = "BBBB";
        Object.getOwnPropertyDescriptor(obj, "prop").configurable = false;

        // The value of these properties remains unchanged
        expect(Object.getOwnPropertyDescriptor(obj, "prop").value).toEqual("ABCD");
        expect(Object.getOwnPropertyDescriptor(obj, "prop").configurable).toBeTrue();
    });

    it('illustrates non-configurable properties', function () {
        let obj = {};

        // Create a non-configurable data (no get/set accessors) property
        Object.defineProperty(obj, "nonconfigurable_prop", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: "ABC"
        });

        // Modifying configurable attribute of a non-configurable property
        // isn't allowed. The holds for enumerable attribute as well as
        // get/set attributes (if property isn't configurable it is not
        // allowed to convert the property from data to accessor or vice
        // versa.
        expect(Object.defineProperty.bind(
            undefined, obj, "nonconfigurable_prop", { configurable: true }))
            .toThrowError(TypeError);

        expect(Object.defineProperty.bind(
            undefined, obj, "nonconfigurable_prop", { enumerable: true }))
            .toThrowError(TypeError);

        expect(Object.defineProperty.bind(
            undefined, obj, "nonconfigurable_prop", { get: () => obj }))
            .toThrowError(TypeError);

        expect(Object.defineProperty.bind(
            undefined, obj, "nonconfigurable_prop", { set: () => obj }))
            .toThrowError(TypeError);

        // But, modifying the writable attribute from TRUE to FALSE is allowed and
        // modifying the value itself is also allowed (if writable is true)
        expect(Object.defineProperty.bind(
            undefined, obj, "nonconfigurable_prop", { writable: false }))
            .not.toThrow();
        obj.nonconfigurable_prop = "AAAA";
        expect(Object.getOwnPropertyDescriptor(obj, "nonconfigurable_prop").writable).toBeFalse();
        expect(Object.getOwnPropertyDescriptor(obj, "nonconfigurable_prop").value).toEqual("ABC");

        // We're not allowed to change the writable attribute from FALSE to TRUE for
        // non-configurable properties
        expect(Object.defineProperty.bind(
            undefined, obj, "nonconfigurable_prop", { writable: true }))
            .toThrowError(TypeError);

        // Attempting to delete a non-configurable property has no effect
        delete obj.nonconfigurable_prop;
        expect(obj.hasOwnProperty("nonconfigurable_prop")).toBeTrue();
    });

    it('illustrates configurable properties', function () {
        let obj = {};

        // Create a configurable data (no get/set accessors) property
        Object.defineProperty(obj, "configurable_prop", {
            configurable: true,
            enumerable: false,
            writable: false,
            value: "ABC"
        });

        // We're allowed to modify any of the attributes of a configurable property
        expect(Object.defineProperty.bind(undefined, obj, "configurable_prop", {
            configurable: false,
            enumerable: true,
            writable: true
        })).not.toThrow();
        obj.configurable_prop = "AAAA";

        expect(Object.getOwnPropertyDescriptor(obj, "configurable_prop").configurable).toBeFalse();
        expect(Object.getOwnPropertyDescriptor(obj, "configurable_prop").enumerable).toBeTrue();
        expect(Object.getOwnPropertyDescriptor(obj, "configurable_prop").writable).toBeTrue();
        expect(Object.getOwnPropertyDescriptor(obj, "configurable_prop").value).toEqual("AAAA");

        // Configurable properties can be deleted
        obj.another_prop = "abc";
        delete obj.another_prop;
        expect(obj.hasOwnProperty("another_prop")).toBeFalse();
    });

    it('illustrates enumerable properties', function () {
        let obj = {};

        // Properties defined by assignment are enumerable
        obj.enumerable_prop = "ABC";

        // Enumerable properties appear when querying with Object.keys
        expect(Object.keys(obj).includes("enumerable_prop")).toBeTrue();

        // Enumerable properties appear when iterating with for-in loop
        let props = [];
        for (let prop in obj) {
            props.push(prop);
        }
        expect(props.includes("enumerable_prop")).toBeTrue();

        // propertyIsEnumerable can be used to check if property is enumerable
        expect(obj.propertyIsEnumerable("enumerable_prop")).toBeTrue();
    });

    it('illustrates non-enumerable properties', function () {
        let obj = {};

        // Define a non-enumerable property
        Object.defineProperty(obj, "nonenumerable_prop", {
            enumerable: false,
            value: "ABC"
        });

        // Object.keys don't report non-enumerable properties
        expect(Object.keys(obj).includes("nonenumerable_prop")).toBeFalse();

        // For-in loop doesn't iterate over non-enumerable properties
        let props = [];
        for (let prop in obj) {
            props.push(prop);
        }
        expect(props.includes("nonenumerable_prop")).toBeFalse();

        // propertyIsEnumerable can be used to confirm that property is not enumerable
        expect(obj.propertyIsEnumerable("nonenumerable_prop")).toBeFalse();

        // We can still access the property even though its not enumerable
        expect(obj.nonenumerable_prop).toEqual("ABC");
    });

    it('illustrates non-writable properties', function () {
        let obj = {};

        // Define a non-writable property
        Object.defineProperty(obj, "nonwritable_prop", {
            writable: false,
            value: "ABCD"
        });

        // Assigning the new value to a non-writable property has no effect
        obj.nonwritable_prop = "AAAA";
        expect(obj.nonwritable_prop).toEqual("ABCD");

        // Assigning a value to a non-writable property throws TypeError in
        // strict mode, even if the new and current values are the same
        expect((function() {
            'use strict';
            obj.nonwritable_prop = "BBBB";
        })).toThrowError(TypeError);
    });

    it('illustrates accessor properties', function () {
        let obj = {
            name: "Mickey",
            surname: "Mouse"
        };

        // Define an accessor property. Accessor property doesn't store the
        // any value itself but instead provides a way to access (set or get)
        // other data properties. For instance, the following accessor property
        // allows to access both 'name' and 'surname' with a single accessor
        // call.
        Object.defineProperty(obj, "fullName", {
            set(value) {
                [this.name, this.surname] = value.split(" ");
            },

            get() {
                return this.name + " " + this.surname;
            }
        });

        expect(obj.fullName).toEqual("Mickey Mouse");
        obj.fullName = "Robert Stark";
        expect(obj.fullName).toEqual("Robert Stark");
        expect(obj.name).toEqual("Robert");
        expect(obj.surname).toEqual("Stark");
        obj.name = "Tony";
        obj.surname = "Stark";
        expect(obj.fullName).toEqual("Tony Stark");
    });

    it('illustrates defining accessors as part of object definition', function () {
        let obj = {
            name: "Mickey",
            surname: "Mouse",

            get fullName() {
                return this.name + " " + this.surname;
            },

            set fullName(v) {
                [this.name, this.surname] = v.split(" ");
            }
        };

        expect(obj.fullName).toEqual("Mickey Mouse");
        obj.fullName = "Robert Stark";
        expect(obj.fullName).toEqual("Robert Stark");
        expect(obj.name).toEqual("Robert");
        expect(obj.surname).toEqual("Stark");
        obj.name = "Tony";
        obj.surname = "Stark";
        expect(obj.fullName).toEqual("Tony Stark");
    });

    it('illustrates converting property from data to accessor and back', function () {
        let obj = {};

        // Define several data properties
        Object.defineProperties(obj, {
            name: {
                writable: true,
                value: "Mickey"
            },

            surname: {
                writable: true,
                value: "Mouse"
            },

            fullName: {
                configurable: true,
                writable: true,
                value: "Mickey Mouse"
            }
        });

        // Convert the 'fullName' to an accessor property
        Object.defineProperty(obj, "fullName", {
            get() {
                return this.name + " " + this.surname;
            },

            set(v) {
                [this.name, this.surname] = v.split(" ");
            }
        });

        obj.fullName = "Tony Stark";
        expect(obj.fullName).toEqual("Tony Stark");
        expect(obj.name).toEqual("Tony");
        expect(obj.surname).toEqual("Stark");
        obj.name = "Bob";
        obj.surname = "Doe";
        expect(obj.fullName).toEqual("Bob Doe");
    });

    it('illustrates that mixing value/writable and get/set attributes is disallowed', function () {
        let obj = {};

        // Mixing data (value and writable) and accessor (get/set) attributes is
        // not allowed.
        expect(function() {
            Object.defineProperty(obj, "prop", {
                writable: true,
                value: "ABC",
                get() {
                    return "A";
                },
                set(v) {

                }
            })
        }).toThrowError(TypeError);
    });
});