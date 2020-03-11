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

    it('illustrates offsetWidth/offsetHeight properties (no scrollbar)', function () {
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

    it('illustrates offsetWidth/offsetHeight properties (with scrollbar)', function () {
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

    /**
     * While offsetWidth/offsetHeight returns the element's layout width and height,
     * getBoundingClientRect() returns the rendering width and height. For example,
     * if element has 'width:100px; transform:scale(0.5);', getBoundingClientRect()
     * will return 50 as the width while offsetWidth will return 100.
     */
    it('illustrates getBoundingClientRect() method', function () {
        // Create a div with fixed width and height
        let div = document.createElement("div");
        div.style.width = "150px";
        div.style.height = "100px";
        div.style.border = "5px solid black";
        div.style.padding = "10px";

        // Apply the scale transformation to the div that will cut its width and
        // height in half
        div.style.transform = "scale(0.5)";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        document.getElementsByTagName("body")[0].appendChild(div);

        // offsetWidth/offsetHeight is unaffected by the scale transformation
        expect(div.offsetWidth).toBe(180);
        expect(div.offsetHeight).toBe(130);

        // However, getBoundingClientRect() takes transformations into account
        // and returns the rendering width and height
        expect(div.getBoundingClientRect().width).toBe(90);
        expect(div.getBoundingClientRect().height).toBe(65);
    });

    it('illustrates clientWidth/clientHeight properties', function () {
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

        // Unlike offsetWidth/offsetHeight, clientWidth/clientHeight include
        // width/height of the visible content plus the padding but do not
        // include border or scrollbars (nor margins but those are not included
        // in offsetWidth/offsetHeight neither). Hence, clientWidth will be:
        // 300px (inner div width) + 20px (left and right padding) = 320px
        // and clientHeight will be:
        // 50px (the height of visible content of container div) + 20px (top and
        // bottom padding) = 70px
        expect(containerDiv.clientWidth).toEqual(320);
        expect(containerDiv.clientHeight).toEqual(70);
    });

    /**
     * scrollWidth/scrollHeight return the entire width/height of an element,
     * as if it was big enough to accommodate its contents without horizontal
     * or vertical scrollbar. For instance, if 100x100 pixels div has contents
     * that is 500px wide and 300px high, the scrollWidth/scrollHeight on the
     * parent div will return 500px and 300px for the width and height. Note
     * that scrollWidth/scrollHeight, just like clientWidth/clientHeight,
     * include the padding but not border or scrollbar.
     */
    it('illustrates scrollWidth/scrollHeight properties', function () {
        // Create the container DIV with fixed width and height
        let containerDiv = document.createElement("div");

        // Set the overflow property of the container DIV to auto. This
        // makes sure that horizontal and vertical scrollbars are added
        // to the div if its contents become to large for the div to
        // accommodate it.
        containerDiv.style.width = "100px";
        containerDiv.style.height = "100px";
        containerDiv.style.overflow = "hidden";
        containerDiv.style.border = "3px solid black";

        // Top/bottom padding is 10px, left/right padding is 0px
        containerDiv.style.padding = "10px 0px";

        // Create the inner div with fixed dimensions
        let innerDiv = document.createElement("div");
        innerDiv.style.width = "300px";
        innerDiv.style.height = "200px";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        containerDiv.appendChild(innerDiv);
        document.getElementsByTagName("body")[0].appendChild(containerDiv);

        // scrollWidth of the container DIV is 300px (innerDiv width) because
        // vertical scrollbar is ignored.
        // scrollHeight is:
        // 200px (innerDiv height) + 20px (top and bottom padding)
        expect(containerDiv.scrollWidth).toBe(300);
        expect(containerDiv.scrollHeight).toBe(220);

        // Compare this with clientWidth/clientHeight that account only for
        // the displayed content width/height
        expect(containerDiv.clientWidth).toBe(100);
        expect(containerDiv.clientHeight).toBe(120);
    });

    it('illustrates (offset|client|scroll)width/height and non-displayed elements', function () {
        // Create a DIV with fixed dimensions
        let div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.padding = "10px";
        div.style.border = "5px solid black";

        // Make sure the div is not displayed
        div.style.display = "none";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        document.getElementsByTagName("body")[0].appendChild(div);

        // offsetWidth/offsetHeight, clientWidth/clientHeight and scrollWidth/scrollHeight
        // of non-displayed elements is 0
        expect(div.offsetWidth).toBe(0);
        expect(div.offsetHeight).toBe(0);
        expect(div.clientWidth).toBe(0);
        expect(div.clientHeight).toBe(0);
        expect(div.scrollWidth).toBe(0);
        expect(div.scrollHeight).toBe(0);
    });

    it('illustrates getBoundingClientRect and non-displayed elements', function () {
        // Create a DIV with fixed dimensions
        let div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.padding = "10px";
        div.style.border = "5px solid black";

        // Make sure the div is not displayed
        div.style.display = "none";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        document.getElementsByTagName("body")[0].appendChild(div);

        // The width/height returned by getBoundingClientRect is 0 for
        // non-displayed elements
        expect(div.getBoundingClientRect().width).toBe(0);
        expect(div.getBoundingClientRect().height).toBe(0);
    });

    it('illustrates obtaining dimensions of non-displayed elements', function () {
        // Create a DIV with fixed dimensions
        let div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.padding = "10px";
        div.style.border = "5px solid black";

        // Make sure the div is not displayed
        div.style.display = "none";

        // Append the DIV to the DOM to make sure its dimensions are calculated
        document.getElementsByTagName("body")[0].appendChild(div);

        // offsetWidth/offsetHeight are now 0
        expect(div.offsetWidth).toBe(0);
        expect(div.offsetHeight).toBe(0);

        // If we wish to get the displayed dimensions of this DIV without making
        // it visible, the following steps can be used:
        // 1) Set the DIV's visibility to hidden. Hidden elements are not rendered
        //    but they still take place in the page (assuming display is not set
        //    to none)
        // 2) Set DIV's position to absolute. By making DIV displayed it interacts
        //    with other page elements and we don't want that. Making the DIV's
        //    position absolute takes it out of the normal page flow so it no other
        //    elements are affected
        // 3) Finally, set DIV's display to block so that we can record its dimensions
        // 4) Restore the original DIV settings after dimensions are recorded
        div.style.visibility = "hidden";
        div.style.position = "absolute";
        div.style.display = "block";

        // offsetWidth/offsetHeight can now be recorded
        expect(div.offsetWidth).toBe(130);
        expect(div.offsetHeight).toBe(130);

        // Restore the original settings
        div.style.display = "none";
        div.style.position = "static";
        div.style.visibility = "visible";

        // offsetWidth/offsetHeight are 0 once again
        expect(div.offsetWidth).toBe(0);
        expect(div.offsetHeight).toBe(0);
    });

    /**
     * For the list of all methods and properties that require up-to-date
     * layout check:  http://ricostacruz.com/cheatsheets/layout-thrashing.html
     */
    it('illustrates batching DOM reads/writes to avoid layout trashing', function () {
        // Create a few divs and add them to DOM
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        let div3 = document.createElement("div");
        document.getElementsByTagName("body")[0].appendChild(div1);
        document.getElementsByTagName("body")[0].appendChild(div2);
        document.getElementsByTagName("body")[0].appendChild(div3);

        // Next, read each DIV's clientWidth and store it to DIV's style width.
        // Note that reading clientWidth is one of those actions that require
        // browser to have up-to-date layout. Hence, in the following segment,
        // browser might have to re-calculate the layout 3 times as the layout
        // might have changed before each read of clientWidth (because of the
        // writes to style.width.
        let div1Width = div1.clientWidth;
        div1.style.width = div1Width + "px";

        let div2Width = div2.clientWidth;
        div2.style.width = div2Width + "px";

        let div3Width = div3.clientWidth;
        div3.style.width = div3Width + "px";

        // A better way is to batch clientWidth read together followed by the
        // style.width writes. This way, the browser might have to re-calculate
        // the layout once on the first clientWidth read but the layout will
        // be up-to-date on two other reads.
        div1Width = div1.clientWidth;
        div2Width = div2.clientWidth;
        div3Width = div3.clientWidth;

        div1.style.width = div1Width + "px";
        div2.style.width = div2Width + "px";
        div3.style.width = div3Width + "px";
    });
});