/**
 * Illustrates JavaScript code realms which are contexts in which
 * JavaScript code exists in. For instance, each frame in the page
 * represents its own realm.
 */
describe("Code Realms", function () {
    it('illustrates crossing code realms', function () {
        // Create an iframe element
        const iframe = document.createElement("iframe");

        // The JavaScript in its srcdoc property invokes a global function
        // from the parent of iframe's window object, which in this case
        // is the global function of the main page's window object
        iframe.srcdoc = "<script> window.parent.testFun(true, 1, 'ABC', []) </script>";
        document.body.appendChild(iframe);

        // Create a promise that is returned to Jasmine framework. Invoking the
        // global `testFun` function will be done asynchronously to the execution
        // of the test method. Hence, we need to make Jasmine wait for this async
        // work to complete.
        // The fact that we're adding `testFun` function property to the window
        // after iframe has already been added to DOM makes no difference, as
        // the iframe's global code won't be executed before the next event-loop
        // iteration
        return new Promise(resolve => {
            // Define a global function that will be invoked from the iframe's
            // code
            window.testFun = (boolean, number, string, array) => {
                // Get the reference to the frame that's origin of the call to
                // `testFun`
                let srcIframe = frames[frames.length - 1];

                // This code and iframe's code exist in two different realms,
                // hence global variables such as Array are different between
                // the two
                expect(Array).not.toBe(srcIframe.Array);
                expect(array).not.toBeInstanceOf(Array);
                expect(array).toBeInstanceOf(srcIframe.Array);

                // Primitive types, on the other hand, are common for all realms
                expect(boolean).toBeInstanceOf(Boolean);
                expect(number).toBeInstanceOf(Number);
                expect(string).toBeInstanceOf(String);

                // Resolve the promise
                resolve();
            };
        });
    });
});