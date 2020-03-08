/**
 * Illustrates how to efficiently manipulate DOM tree using JavaScript.
 */
describe("Document Object Model", function () {
    // A helper that traverses the DOM tree starting in specified root
    function* traverseDomTree(root) {
        // Visit the current root node
        yield root;

        for (let child of root.childNodes) {
            yield* traverseDomTree(child);
        }
    }

    it('illustrates injecting HTML into the DOM', function () {
        // Converts HTML string into a DOM tree using the innerHTML
        // property
        function convertHTMLToDOM(htmlString) {
            // Create a dummy DIV element that will be the root of the
            // new DOM tree
            let dummyDiv = document.createElement("div");
            dummyDiv.innerHTML = htmlString;
            return dummyDiv;
        }

        let domTree = convertHTMLToDOM(
            "<div><h1></h1><article><p></p><img></article></div><footer><p></p></footer>");

        // The extra div in the front accounts for the dummy div element that
        // serves as the root of the created DOM subtree
        let expectedTraverseOrder= [
            "div", "div", "h1", "article", "p", "img", "footer", "p"
        ];

        let i = 0;
        for (let node of traverseDomTree(domTree)) {
            expect(node.nodeName.toLowerCase()).toEqual(expectedTraverseOrder[i++]);
        }
    });

    /**
     * DocumentFragment interface represents a minimal document object
     * that has no parent. It's essentially a lightweight version of
     * the Document.
     *
     * It's commonly used to build up a DOM subtree within a fragment and
     * then append that tree to the page. Doing this moves the fragment's
     * tree into the DOM leaving an empty DocumentFragment behind. As
     * all nodes are inserted to the DOM at once, only one reflow and
     * render is triggered as opposed to potentially one of each for
     * every inserted node if nodes were inserted separately.
     */
    it('illustrates DocumentFragment interface', function () {
        function createFragment() {
            let fragment = document.createDocumentFragment();
            let dummyDiv = document.createElement("div");
            dummyDiv.innerHTML = "<div><h1></h1><article><p></p><img></article></div><footer><p></p></footer>";

            for (let child of dummyDiv.children) {
                fragment.appendChild(child);
            }

            return fragment;
        }

        let fragment = createFragment();
        expect(fragment.hasChildNodes()).toBeTrue();

        // Append the fragment to another DIV element
        let div = document.createElement("div");
        div.appendChild(fragment);

        // Assert that the fragment is now empty
        expect(fragment.hasChildNodes()).toBeFalse();

        // Also assert that the created DOM tree is as expected The extra
        // div in the front accounts for the dummy div element that the
        // servers as the root of the created DOM subtree
        let expectedTraverseOrder= [
            "div", "div", "h1", "article", "p", "img", "footer", "p"
        ];

        let i = 0;
        for (let node of traverseDomTree(div)) {
            expect(node.nodeName.toLowerCase()).toEqual(expectedTraverseOrder[i++]);
        }
    });

    /**
     * DOM attributes and properties don't share the same value. For example,
     * element's ID attribute that can be set with elem.setAttribute("id", value)
     * and elements ID property that can be set with elem.id = value aren't always
     * the same value. However, in this case changing the value of the property
     * updates the value of the attribute and vice-versa. But, this does not
     * happen for user-defined attributes that may be placed on elements. For
     * example, elem.setAttribute("user-defined-attr", value) won't automatically
     * create an elem.user-defined-attr property.
     */
    it('illustrates DOM attributes and properties', function () {
        let div = document.createElement("div");

        // Set the ID attribute with setAttribute method and verify that
        // the attribute has expected value with getAttribute
        div.setAttribute("id", "div1");
        expect(div.getAttribute("id")).toEqual("div1");

        // Set the ID property of the div element. Check that getAttribute
        // returns the new ID value
        div.id = "div2";
        expect(div.id).toEqual("div2");
        expect(div.getAttribute("id")).toEqual("div2");

        // Set the ID attribute with setAttribute and confirm that div's
        // ID property has new value as well
        div.setAttribute("id", "div3");
        expect(div.id).toEqual("div3");
    });
});