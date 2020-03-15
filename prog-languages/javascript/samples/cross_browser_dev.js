/**
 * Illustrates techniques for dealing with cross browser
 * development issues.
 */
describe("Cross Browser Development", function () {
    it('illustrates DOM clobbering (or greedy IDs)', function () {
        // Create a form with one text and one submit input. The form is
        // embedded into the div so that div's innerHTML can be used to
        // inject HTML into the DOM>
        let containerDiv= document.createElement("div");
        containerDiv.innerHTML =
            "<form id='form'>" +
            "  <input type='text' id='firstName'>" +
            "  <input type='submit' name='clickMe'>" +
            "  <p id='someText'></p>" +
            "</form>";

        // Add container div to the DOM
        document.body.appendChild(containerDiv);

        // One would expect that form has no `firstName` or `clickMe`
        // properties. However, browser added these two properties to
        // the form and set them to point to the text input whose ID
        // is `firstName` and submit input whose name is `clickMe`.
        // This behavior comes from early browsers that didn't support
        // all the different ways of accessing children elements of
        // modern browsers, hence this was an easy way to access form's
        // inputs. Note that browser didn't add `someText` property to
        // the form, because the element with `someText` ID is not an
        // input element.
        let form = document.getElementById("form");
        expect(form.firstName).toBe(document.getElementById("firstName"));
        expect(form.clickMe).toBe(document.getElementsByName("clickMe")[0]);
        expect(form.someText).toBeUndefined();

        // Note, however, that browser will use this feature only for
        // form elements. Example below shows that the same feature isn't
        // used for div containers
        containerDiv.innerHTML +=
            "<div id='someDiv'>" +
            "  <input type='text' id='textField'" +
            "  <input type='submit' name='submitButton'" +
            "  <p id='someParagraph'></p>" +
            "</div>";

        let someDiv = document.getElementById("someDiv");
        expect(someDiv.textField).toBeUndefined();
        expect(someDiv.submitButton).toBeUndefined();
        expect(someDiv.someParagraph).toBeUndefined();
    });

    it('illustrates anticipating upcoming API change', function () {
        // Internet Explorer added support for addEventListener API
        // in IE 9. IE 8 and earlier implement the IE-proprietary
        // attachEvent. The following following wrapper function
        // check whether standard-compliant API is available, if
        // not it checks whether attachEvent is implemented, and if
        // that's not present it does nothing. Feature detection
        // should always be preferred to checking the agent name
        // as new browser release might implement a missing API
        // or fix a bug.
        function bindEvent(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler);
            }
            else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            }
        }
    });

    it('illustrates polyfills', function () {
        // Array.prototype.find is an ES6 feature. The following polyfill
        // implements the method for browsers that don't natively support
        // it.
        if (!Array.prototype.find) {
            Array.prototype.find = function (predicate) {
                if (this == null) {
                    throw TypeError("'this' is null or not defined");
                }

                if (typeof predicate !== "function") {
                    throw TypeError("'predicate' must be a function");
                }

                let length = this.length >>> 0;
                let thisArg = arguments[1];

                for (let i = 0; i < length; ++i) {
                    if (predicate.call(thisArg, this[i], i, this)) {
                        return this[i];
                    }
                }

                return undefined;
            };
        }
    });
});