/**
 * A NodeJS module that exports a Person class.
 */
module.exports = class Person {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }
};