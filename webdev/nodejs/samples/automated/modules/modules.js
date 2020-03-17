/**
 * Illustrates NodeJS modules support (partial implementation of the
 * CommonJS standard).
 */
const assert = require("assert").strict;
const Person = require("./person.js");
const Helpers = require("./helpers");

describe("NodeJS Modules", function () {
    it('illustrates importing NodeJS modules', function () {
        const p = new Person("Mickey", "Mouse");
        assert.equal(p.getName(), "Mickey");
        assert.equal(p.getSurname(), "Mouse");

        assert.deepEqual(Helpers.sortDescending([1, 2, 3, 5]), [5, 3, 2, 1]);
        assert.equal(Helpers.config.option1, "ABC");
    });
});