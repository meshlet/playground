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
    })
});