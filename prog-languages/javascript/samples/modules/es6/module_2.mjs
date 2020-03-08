/**
 * An ES6 module.
 */

// The default binding for this module. When importing symbols
// from this module without the curly braces, this class
// is imported.
export default class Person {
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

// Private module variable
let privateVar = "ABC";

function setPrivateVar(value) {
    privateVar = value;
}

function getPrivateVar() {
    return privateVar;
}

// Rename and export the identifiers
export { setPrivateVar as setVar, getPrivateVar as getVar };