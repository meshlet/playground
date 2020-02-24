/**
 * Illustrates how to use the XMLHttpRequest object to make
 * asynchronous requests to the server. The tests use xhr-mock
 * to mock the server responses, hence no running server is
 * needed.
 */

function getJsonWithPromise(method, url) {
    return new Promise((resolve, reject) => {
        // Create a XMLHttpRequest instance
        const request = new XMLHttpRequest();

        request.onload = function() {
            try {
                if (this.status === 200) {
                    // Resolve the promise and pass the parsed JSON data
                    resolve(this.response);
                }
                else {
                    reject(this.status + " " + request.statusText);
                }
            }
            catch(e) {
                reject(e.message);
            }
        };

        // Register the callback that's invoked if there's an error
        // in client-server communication
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
    // Replace the real XHR object with the mock XHR before each test
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

    it('should resolve with status 200 and empty response using GET', function () {
        XHRMock.get("/url/to/file", (request, response) => {
            expect(request.header("Content-Type")).toEqual("application/json");
            return response.status(200).body('{}')
        });

        return getJsonWithPromise("get", "/url/to/file");
    });
});