/**
 * Illustrates various JavaScript scoping rules for variables
 * and functions.
 */
describe("Scoping", function () {
    it('illustrates scope of variables declared with "var" keyword', function () {
        var outer_variable = "AAA";
        (function fn() {
            var func_variable = "BBB";
            for (var i = 0; i < 3; ++i) {
                var block_variable = "CCC";

                // We can access all the variables at this point
                expect(outer_variable).toEqual("AAA");
                expect(func_variable).toEqual("BBB");
                expect(block_variable).toEqual("CCC");
            }

            // Variables 'i' and 'block_variable' are accessible here as well.
            // This is because they're declared with 'var' keyword, hence they
            // belong to the closest function (or global) scope which is
            // function 'fn' in this case.
            expect(i).toBe(3);
            expect(block_variable).toEqual("CCC");
        })();

        // None of the variables defined within function 'fn' are not visible
        // outside of it
        expect(typeof(func_variable)).toEqual("undefined");
        expect(typeof(i)).toEqual("undefined");
        expect(typeof(block_variable)).toEqual("undefined");
    });

    it('illustrates scope of variables declared with "let" and "const" keywords', function () {
        const outer_variable = "AAA";
        (function fn() {
            let func_variable = "BBB";
            for (let i = 0; i < 3; ++i) {
                const block_variable = "CCC";

                // We can access all the variables at this point
                expect(outer_variable).toEqual("AAA");
                expect(func_variable).toEqual("BBB");
                expect(block_variable).toEqual("CCC");
            }

            // Variables 'i' and 'block_variable' aren't accessible at this point.
            // As they're declared with 'let' and 'const' keywords respectively,
            // they're bound to the closest scope (lexical environment) which in
            // this case is the for loop block.
            expect(typeof(i)).toEqual("undefined");
            expect(typeof(block_variable)).toEqual("undefined");
        })();

        // None of the variables defined within function 'fn' are not visible
        // outside of it
        expect(typeof(func_variable)).toEqual("undefined");
        expect(typeof(i)).toEqual("undefined");
        expect(typeof(block_variable)).toEqual("undefined");
    });

    it('illustrates scoping rules for functions', function () {
        // We're able to access the function 'fun' before it's been defined.
        // This is because 'fun' is defined as function declaration and these
        // are added to the current scope before the code execution starts.
        expect(typeof(fun)).toEqual("function");

        // We can't access the function expression before it's defined. These
        // are added to the current scope only once execution reaches their
        // definition.
        expect(typeof(fun_expression)).toEqual("undefined");

        // We can't access the arrow function before it's defined. Like function
        // expressions, arrow functions are added to the current scope only once
        // execution reaches their definition.
        expect(typeof(arrow_fun)).toEqual("undefined");

        function fun() {}
        var fun_expression = function () {};
        var arrow_fun = () => {};
    });

    it('illustrates overriding function identifiers', function () {
        // We're able to access the 'fun' function before it's defined. Note that
        // a variable 'fun' is defined just after this assert and assigned to 3.
        // However, this will override the function identifier only once the
        // execution reaches the variable definition, while function identifiers
        // are registered before the execution starts.
        expect(typeof(fun)).toEqual("function");

        // Define the variable named 'fun'
        var fun = 3;

        // 'fun' identifier now identifies as a number
        expect(typeof(fun)).toEqual("number");

        // The fact that function is defined after the variable 'fun' in code
        // makes no difference. During the execution the function declaration
        // are ignored so this definition has no impact on the value of the
        // 'fun' identifier;
        function fun() {}

        // The 'fun' is still a number
        expect(typeof(fun)).toEqual("number");
    });
});