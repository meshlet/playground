/**
 * Illustrates native JavaScript modules introduced in ES6.
 */

// Import some of the ES6 module named identifiers. Imported identifiers
// are also renamed using the 'as' keyword.
import { getFullName as getName, setFullName as setName } from "./module_1.mjs";

// Import all named identifiers exported by a module
import * as simpleModule from "./module_2.mjs";

// Import the default export from a module
import Person from "./module_2.mjs";

describe("ES6 Modules", function () {
    it('illustrates how to import some of the ES6 module identifiers', function () {
        expect(getName()).toEqual("Mickey Mouse");
        setName("Tony Stark");
        expect(getName()).toEqual("Tony Stark");
    });

    it('illustrates how to import all exported module identifiers', function () {
        simpleModule.setVar("OUI");
        expect(simpleModule.getVar()).toEqual("OUI");
    });

    it('illustrates how to import module default export', function () {
        let person = new Person();
        expect(person.fullName).toEqual("Mickey Mouse");
        person.fullName = "Tony Stark";
        expect(person.fullName).toEqual("Tony Stark");
    });

    it('illustrates dynamic module loading', function () {
        // 'import()' function can be used to load modules dynamically.
        // The function returns a promise which fulfills with a module
        // object (similar to using 'import * as Module from "./module.js"').
        return import("./module_2.mjs")
            .then(Module => {
                Module.setVar("RTI");
                expect(Module.getVar()).toEqual("RTI");
            });
    });
});