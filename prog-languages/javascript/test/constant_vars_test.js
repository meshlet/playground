/**
 * Illustrates constant variables. These tests are not related to
 * a particular functionality.
 */
describe("Constant Variables", function () {
    it('illustrates constant variables', function () {
        // Re-assigning a const variable is not allowed
        const const_var1 = "AFBC";
        expect(function () {
            const_var1 = "FFFF";
        }).toThrow();

        // Modifying the already assigned value of the const variable
        // (for example, adding a new property to it) is allowed
        const const_var2 = {};
        const_var2.field = "ABC";
        expect(const_var2.field).toEqual("ABC");

        // Modifying a const array variable is similarly allowed (but not assigning
        // a new array to it)
        const array = [];
        array.push(5);
        expect(array[0]).toBe(5);
    });
});