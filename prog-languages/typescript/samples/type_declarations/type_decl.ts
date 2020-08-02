/**
 * Illustrates type declaration files in TypeScript.
 */

import "mocha";
import { expect } from "chai";

// Import an ambient module
// The ambient module declarations need to be defined in an external JS
// library
import AmbientModule from "ambient_module";
import { VARIABLE } from "ambient_module";

describe("Type Declarations", function () {
    it('illustrates ambient variable declarations', function () {
        // ambient_var_decl.d.ts has declared GLOBAL_VAR variable that is
        // accessible everywhere without importing it first. The variable
        // is defined in definitions.js
        expect(GLOBAL_VAR).to.be.equal("ABCD");
    });

    it('illustrates ambient type declarations', function () {
        // ToArray<T> type is declared in ambient_type_decl.ts
        type NumberArray = ToArray<number>;
        const arr: NumberArray = [2, 3, 4];
    });
});