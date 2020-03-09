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
     * DOM attributes and properties aren't generally the same value. For example,
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

    it('illustrates the difference between in-page style sheet and inline style attribute', function () {
        // Create a style element, add some CSS to it and append it to
        // the head element
        const css = "div#testDiv { font-size: 20px; border: 0 solid black; }";
        const styleElem = document.createElement("style");
        styleElem.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(styleElem);

        // Create a #testDiv within an invisible container div, define
        // its 'style' attribute and add the container div to the body
        // of the page
        let containerDiv = document.createElement("div");
        containerDiv.style.display = "none";
        containerDiv.innerHTML = "<div id='testDiv' style='color:red;'></div>";
        document.getElementsByTagName("body")[0].appendChild(containerDiv);

        // Obtain the reference to #testDiv div
        let testDiv = document.getElementById("testDiv");
        expect(testDiv).not.toBeNull();

        // Assert that inline style attribute is respected
        expect(testDiv.style.color).toEqual("red");

        // However, the div's style object doesn't reflect any style information
        // inherited from (in-page or external) CSS style sheets.
        expect(testDiv.style.fontSize).toEqual("");
        expect(testDiv.style.border).toEqual("");

        // Modify the CSS border using the element's style property and make sure
        // the change has been recorded by testing the border width
        testDiv.style.border = "2px solid red";
        expect(testDiv.style.borderWidth).toEqual("2px");

        // Cleanup
        document.getElementsByTagName("head")[0].removeChild(styleElem);
        document.getElementsByTagName("body")[0].removeChild(containerDiv);
    });

    it('illustrates fetching computed style values', function () {
        // Create a style element, add some CSS to it and append it to
        // the head element
        const css = "div#testDiv { font-size: 20px; border: 1px dashed rgb(0, 255, 0); display:inline; color:yellow; background-color: blue; }";
        const styleElem = document.createElement("style");
        styleElem.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(styleElem);

        // Create a #testDiv within an invisible container div, define
        // its 'style' attribute and add the container div to the body
        // of the page
        let containerDiv = document.createElement("div");
        containerDiv.style.display = "none";
        containerDiv.innerHTML = "<div id='testDiv' style='color:red;'></div>";
        document.getElementsByTagName("body")[0].appendChild(containerDiv);

        // Obtain the reference to #testDiv div
        let testDiv = document.getElementById("testDiv");
        expect(testDiv).not.toBeNull();

        // Use 'getComputedStyle' function to compute the actual style information for
        // the div element
        let computedStyles = getComputedStyle(testDiv);

        // CSS color property is specified both in div's style attribute as well as
        // in the in-page style sheet. Style attribute must take precedence.
        expect(computedStyles.getPropertyValue("color")).toEqual("rgb(255, 0, 0)");

        // getPropertyValue uses CSS dashed naming for properties instead of the
        // camel case naming used by JavaScript style object
        expect(computedStyles.getPropertyValue("font-size")).toEqual("20px");
        expect(computedStyles.getPropertyValue("display")).toEqual("inline");
        expect(computedStyles.getPropertyValue("background-color")).toEqual("rgb(0, 0, 255)");

        expect(computedStyles.getPropertyValue("border-style")).toEqual("dashed");
        expect(computedStyles.getPropertyValue("border-color")).toEqual("rgb(0, 255, 0)");
    });

    it('illustrates the offsetWidth/offsetHeight (no scrollbar)', function () {
        // Create the container DIV whose width and height are left unspecified.
        // This makes sure that DIV will extend as much as it needs to hold its
        // children.
        let containerDiv = document.createElement("div");

        // Set the display property to inline-block to make sure the DIV's width
        // doesn't take all the space available (the behavior when display is set
        // to block which is the default for DIVs) but instead only extends enough
        // to hold its children.
        containerDiv.style.display = "inline-block";
        containerDiv.style.border = "5px solid black";
        containerDiv.style.padding = "10px";

        // Create the inner div with fixed dimensions
        let innerDiv = document.createElement("div");
        innerDiv.style.width = "300px";
        innerDiv.style.height = "200px";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        containerDiv.appendChild(innerDiv);
        document.getElementsByTagName("body")[0].appendChild(containerDiv);

        // offsetWidth/offsetHeight include the border width, padding, scrollbar (if
        // any) and the width of the visible content. Note that no scrollbar is added
        // to container DIV in this case as both its width and height automatically
        // extend to accommodate its children.
        // offsetWidth is be equal to:
        // 300px (innerDiv width) + 20px (left and right border width) + 10px (left and
        // right padding = 330px.
        // offsetHeight is similarly equal to: 230px.
        expect(containerDiv.offsetWidth).toBe(330);
        expect(containerDiv.offsetHeight).toBe(230);
    });

    it('illustrates the offsetWidth/offsetHeight (with scrollbar)', function () {
        // Create the container DIV with auto width and fixed height. That means
        // that DIV's width grows to accommodate its children but its height
        // remains fixed.
        let containerDiv = document.createElement("div");

        // Set the display property to inline-block to make sure the DIV's width
        // doesn't take all the space available (the behavior when display is set
        // to block which is the default for DIVs) but instead only extends enough
        // to hold its children. Additionally, set overflow-y to auto so that
        // vertical scrollbar is added to the DIV in case the content becomes to
        // high to fit inside the DIV.
        containerDiv.style.height = "50px";
        containerDiv.style.display = "inline-block";
        containerDiv.style.overflowY = "auto";
        containerDiv.style.border = "5px solid black";
        containerDiv.style.padding = "10px";

        // Create the inner div with fixed dimensions
        let innerDiv = document.createElement("div");
        innerDiv.style.width = "300px";
        innerDiv.style.height = "200px";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        containerDiv.appendChild(innerDiv);
        document.getElementsByTagName("body")[0].appendChild(containerDiv);

        // offsetWidth/offsetHeight include the border width, padding, scrollbar (if
        // any) and the width of the visible content. Note that vertical scrollbar is
        // added in this case, so its width is included in the offsetWidth. Hence, the
        // offset width will be greater than the 330 pixels because the scrollbar width
        // is accounted for as well. offsetHeight will be:
        // 50px (fixed height of the div) + 20px (top and bottom padding) + 10px (top
        // and bottom border) = 80px.
        expect(containerDiv.offsetWidth).toBeGreaterThan(330);
        expect(containerDiv.offsetHeight).toBe(80);
    });

    // Add more samples that illustrate the rest of properties for obtaining element
    // dimensions:
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
});