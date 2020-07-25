/**
 * Illustrates different ways of reporting and handling errors
 * in TypeScript.
 */

import "mocha";
import { expect } from "chai";

describe("Handling Errors", function () {
    /**
     * The following illustrates reporting errors by returning exceptions
     * instead of throwing them. This forces the user to handle those
     * errors explicitly and is hence more safe (albeit more verbose too).
     */
    it('illustrates reporting errors by returning exceptions', function () {
        // Say a function returns a string on success and returns a
        // RangeError or SyntaxError on failure. Instead of throwing
        // an exception, the function returns it to the caller
        function fancyFunction(a: number): string | RangeError | SyntaxError {
            if (a < 10) {
                return "Success";
            }
            else if (a < 20) {
                return new RangeError("error message");
            }
            return new SyntaxError("syntax error");
        }

        // The user of this function must refine the type of the return
        // value if they want to access the success value of the call
        const retval = fancyFunction(15);
        // retval.toUpperCase(); // string | RangeError | SyntaxError has no toUpperCase method

        if (retval instanceof RangeError) {
            // Report an error
        }
        else if (retval instanceof SyntaxError) {
            // Report an error
        }
        else {
            // TypeScript now knows that retval is a string
            retval.toUpperCase();
        }
    });

    it('illustrates handling errors with Option type', function () {
        // Define the Option interface
        interface Option<T> {
            execute<U>(fn: (value: T) => Option<U>): Option<U>;
            getResultOrError(value: T): T;
        }

        // A class that represents a non-empty Option
        class Some<T> implements Option<T> {
            constructor (
                private value: T
            ) {}

            // These two overloads help narrow down the return type of
            // Some<T>.execute method. If TypeScript knows that `fn`
            // returns None at compile time it will use the first overload
            // and will return a value of None type. Conversely, if `fn`
            // returns Some<U> than the second overloads is used which will
            // return a value of type Some<U>. Only when `fn` actually
            // returns the base type Option<U> will the third overload be
            // used.
            execute<U>(fn: (value: T) => None): None;
            execute<U>(fn: (value: T) => Some<U>): Some<U>;
            execute<U>(fn: (value: T) => Option<U>): Option<U> {
                return fn(this.value);
            }

            getResultOrError(value: T): T {
                return this.value;
            }
        }

        // A class that represents and empty Option
        class None implements Option<never> {
            execute(): None {
                return this;
            }

            getResultOrError<T>(value: T): T {
                return value;
            }
        }

        // Finally, a function that creates Options
        function Option<T>(value: null | undefined): None;
        function Option<T>(value: T): Some<T>;
        function Option<T>(value: T): Option<T> {
            if (value == null) {
                // If user has passed null or undefined return an empty Option
                return new None();
            }

            // Otherwise, return an option with that value
            return new Some(value);
        }

        // The following illustrates how to use Option types to chain
        // multiple function calls some or all of which can fail.
        // The following function produces an Option with a string
        // representing user input, or an empty Option if an error
        // happened depending on the `success` parameter.
        function mockUserInput(success: boolean, input: string): Option<string> {
            if (success) {
                // Return mocked user input
                return new Some(input);
            }

            // Return an empty Option
            return new None();
        }

        // A function that parses a date. It returns a non-empty Option
        // with Date object if date string is valid, empty option otherwise
        function parseDate(str: string): Option<Date> {
            const date = new Date(str);
            if (date.toString() === "Invalid Date") {
                // String is not a valid date
                return new None();
            }

            // Return an option with the parsed date
            return new Some(date);
        }

        // The following is an example of chaining function calls that
        // return Options. This call chain is successful
        let result = mockUserInput(true, "1979/09/23")
            .execute(parseDate)
            .execute(date => new Some(date.toDateString()))
            .execute(dateStr => new Some("Date is " + dateStr))
            .getResultOrError("Error occurred");

        expect(result).to.be.equal("Date is Sun Sep 23 1979");

        // The `parseDate` fails in the following chain
        result = mockUserInput(true, "1945/54/23")
            .execute(parseDate)
            .execute(date => new Some(date.toDateString()))
            .execute(dateStr => new Some("Date is " + dateStr))
            .getResultOrError("Error occurred");

        expect(result).to.be.equal("Error occurred");

        // `mockUserInput` fails in the following call chain
        result = mockUserInput(false, "1979/09/23")
            .execute(parseDate)
            .execute(date => new Some(date.toDateString()))
            .execute(dateStr => new Some("Date is " + dateStr))
            .getResultOrError("Error occurred");

        expect(result).to.be.equal("Error occurred");
    });
});