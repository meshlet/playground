/**
 * Illustrates how to use the XMLHttpRequest object to make
 * asynchronous requests to the server. The tests use xhr-mock
 * to mock the server responses, hence no running server is
 * needed.
 */

/**
 * Retrieves a JSON file from the given URL using the specified
 * HTTP method using the XMLHttpRequest. The method returns a
 * promise object to be used by the caller to wait for the
 * response.
 *
 * @param method
 * @param url
 * @returns {Promise<any>}
 */
function getJsonWithPromise(method, url) {
    return new Promise((resolve, reject) => {
        // Create a XMLHttpRequest instance
        const request = new XMLHttpRequest();

        request.onload = function() {
            try {
                if (this.status === 200) {
                    // Resolve the promise and pass the parsed JSON data
                    resolve(JSON.parse(this.response));
                }
                else {
                    reject(this.status + " " + request.statusText);
                }
            }
            catch(e) {
                reject(e);
            }
        };

        // Register the callback that's invoked in case of a network error
        request.onerror = function() {
            reject(this.status + " " + this.statusText);
        };

        // Initialize and send the request
        request.open(method, url);
        request.setRequestHeader('Content-Type', "application/json");
        request.send();
    });
}

describe("XMLHttpRequest", function () {
    // Load the xhr-mock script before test execution starts. Note that
    // function returns a promise object. This notifies Jasmine framework
    // that it needs to wait for the promise to be resolved before the
    // execution continues. And the promise is resolved only once the
    // xhr-mock is fully loaded.
    beforeAll(function() {
        return new Promise((resolve, reject) => {
            // Add the xhr-mock script to the page
            let xhr_mock_script = document.createElement("script");
            xhr_mock_script.onload = function() {
                // Notify the Jasmine framework that async work has been finished
                resolve();
            };

            xhr_mock_script.src = "https://unpkg.com/xhr-mock/dist/xhr-mock.js";
            xhr_mock_script.async = false;
            document.getElementsByTagName("head")[0].appendChild(xhr_mock_script);
        })
    });

    // Replace the actual XHR object with the mock before each test
    beforeEach(() => {
        XHRMock.setup();
    });

    // Put the real XHR object back and clear the mocks after each test
    afterEach(() => {
        XHRMock.teardown()
    });

    it('should resolve with status 200 returning empty response', function () {
        XHRMock.get("/url/to/file", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response.status(200).reason("OK").body('{}');
        });

        // Register a callback that should run when promise is resolved
        // successfully and return the promise back to Jasmine framework
        // to wait for it before it continues running other tests.
        return getJsonWithPromise("get", "/url/to/file")
            .then((response) => {
                expect(response).toEqual({});
            });
    });

    it('should resolve with status 200 returning non-empty response', function () {
        XHRMock.get("/url/to/file", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response.status(200).reason("OK").body('{"data":"abc", "id":1}');
        });

        // Register a callback that should run when promise is resolved
        // successfully and return the promise back to Jasmine framework
        // to wait for it before it continues running other tests.
        return getJsonWithPromise("get", "/url/to/file")
            .then((response) => {
                expect(response).toEqual({data: "abc", id: 1});
            });
    });

    it('should gracefully fail on invalid JSON response', function () {
        XHRMock.get("/url/to/file", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response.status(200).reason("OK").body('{"data":"abc", "id":');
        });

        // Register a callback that should run when promise is resolved
        // unsuccessfully and return the promise back to Jasmine framework
        // to wait for it before it continues running other tests.
        return getJsonWithPromise("get", "/url/to/file")
            .then(() => {
                // Promise must not resolve successfully (JSON response is invalid)
                expect(true).toBeFalse();
            })
            .catch((exception) => {
                // JSON.parse throws SyntaxError on invalid JSON string
                expect(exception).toBeInstanceOf(SyntaxError);
            });
    });

    it('should gracefully fail on client error', function () {
        XHRMock.get("/url/to/file", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response.status(404).reason("Not Found");
        });

        // Register a callback that should run when promise is resolved
        // unsuccessfully and return the promise back to Jasmine framework
        // to wait for it before it continues running other tests.
        return getJsonWithPromise("get", "/url/to/file")
            .then(() => {
                // Promise must not resolve successfully (client error has occurred)
                expect(true).toBeFalse();
            })
            .catch((exception) => {
                // JSON.parse throws SyntaxError on invalid JSON string
                expect(exception).toEqual("404 Not Found");
            });
    });

    it('should gracefully handle network issues', function () {
        XHRMock.get("/", () =>  Promise.reject(new Error()));
        return getJsonWithPromise("get", "/")
            .catch(() => {});
    });

    it('illustrates how to combine generator functions and promises', function () {
        // Mock response for the list of scientists request
        XHRMock.get("/data/scientists.json", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response
                .status(200)
                .reason("OK")
                .body(
                    '[{"id": 0, "first_name":"Nikola", "last_name":"Tesla"},' +
                    ' {"id": 1, "first_name":"George", "last_name":"Bool"},' +
                    ' {"id": 2, "first_name":"Alan", "last_name":"Turing"}]');
        });

        // Mock response for the request on Alan Turing's info
        XHRMock.get("/data/alan_turing.json", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response
                .status(200)
                .reason("OK")
                .body('{"born": "23 June 1912", "died": "7 June 1954", "nationality": "English", "birth_place": "London"}');
        });

        // Mock response for the request on information about London
        XHRMock.get("/data/london.json", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response
                .status(200)
                .reason("OK")
                .body('{"area": 1572, "population": 8908081, "website": "london.gov.uk"}');
        });

        // Function that drives the generator function
        function async(generatorFun) {
            let iter = generatorFun();

            // The function that handles each value produced by the generator
            function handle(iterResult) {
                if (iterResult.done) {
                    // Return if iterator has no more values to produce
                    return;
                }

                if (iterResult.value instanceof Promise) {
                    // The iterator produced a promise. Register the onFulfilled and
                    // onRejected callbacks on the promise, so we can handle the
                    // success or failure at later time.
                    iterResult.value
                        .then(result => {
                            // Promise has been fulfilled. Pass the value it has been fulfilled
                            // with to the iterator via the next method. At the same time, pass
                            // the value returned by the next (another generated value if any)
                            // to another call to handle function.
                            handle(iter.next(result));
                        })
                        .catch(error => {
                            // Also register the failure callback and pass the failure on to
                            // the iterator. Any error will terminate the iterator (it will
                            // make it jump over any remaining yield statements to the end of
                            // the generator function body).
                            iter.throw(error);
                        });
                }
            }

            // Kick-start the iterator and pass the first value it yields to the
            // handle() function
            handle(iter.next());
        }

        // Return the promise back to Jasmine framework to make it wait for the
        // asynchronous actions in this test before it completes the test. Otherwise,
        // Jasmine might run its afterEach() callback which will teardown XHRMock
        // which will in turn expose the actual XHR object (and all XHR requests will
        // fail as there's no server listening).
        return new Promise(resolve => {
            // Invoke the async function with the generator function
            async(function* () {
                try {
                    // Get the list of scientists from the server
                    let scientists = yield getJsonWithPromise("get", "/data/scientists.json");
                    expect(scientists.length).toBe(3);
                    expect(scientists[2].first_name.toLowerCase()).toEqual("alan");
                    expect(scientists[2].last_name.toLowerCase()).toEqual("turing");

                    // Get the info on Alan Turing
                    let alan_turing_info = yield getJsonWithPromise(
                        "get",
                        "/data/" + scientists[2].first_name.toLowerCase() + "_" + scientists[2].last_name.toLowerCase() + ".json");
                    expect(alan_turing_info.birth_place.toLowerCase()).toEqual("london");

                    // Get the info on London
                    let london_info = yield getJsonWithPromise(
                        "get",
                        "/data/" + alan_turing_info.birth_place.toLowerCase() + ".json");
                    expect(london_info.website).toEqual("london.gov.uk");
                }
                catch (error) {
                    // We don't expect any errors in this test
                    expect(true).toBeFalse();
                }

                // Fulfill the promise returned to the Jasmine framework. This will notify
                // to Jasmine that it's safe to complete the test.
                resolve();
            });
        });
    });
});