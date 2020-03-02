/**
 * Builds and returns the following DOM subtree:
 *
 * <div>
 *   <h1></h1>
 *   <form>
 *     <input>
 *     <button></button>
 *   </form>
 *   <div>
 *     <article>
 *       <img>
 *       <span></span>
 *       <p>
 *         <span></span>
 *       </p>
 *     <article>
 *   </div>
 * </div>
 *
 * @returns {{traversal_order: string[], dom_subtree: HTMLDivElement}}
 */
function createDomSubtree() {
    let subtree = document.createElement("div");
    subtree.appendChild(document.createElement("h1"));
    let form = document.createElement("form");
    form.appendChild(document.createElement("input"));
    form.appendChild(document.createElement("button"));
    subtree.appendChild(form);
    let inner_div = document.createElement("div");
    let article = document.createElement("article");
    article.appendChild(document.createElement("img"));
    article.appendChild(document.createElement("span"));
    let p = document.createElement("p");
    p.appendChild(document.createElement("span"));
    article.appendChild(p);
    inner_div.appendChild(article);
    subtree.appendChild(inner_div);

    return {
        dom_subtree: subtree,
        traversal_order: ["div", "h1", "form", "input", "button", "div", "article", "img", "span", "p", "span"]
    };
}

/**
 * Traverses the DOM tree with specified root. At each level of the tree,
 * the root is visited first followed by its children. Children are visited
 * in the order they appear in parent's children list.
 *
 * @param root
 * @param callback
 */
function traverseDom(root, callback) {
    // Visit the root
    callback(root);

    // Traverse the children of the current root
    for (let child of root.children) {
        traverseDom(child, callback);
    }
}

/**
 * Similar to traverseDom but instead of recursion the tree is traversed
 * using the generator function. The subtree of each element is visited
 * by yielding control to another instance of the generator (which in
 * practice acts as a recursive call).
 *
 * @param root
 * @returns {IterableIterator<HTMLElement>}
 */
function* traverseDomWithGenerator(root) {
    // Visit the root right away but yielding to the caller
    yield root;

    // Traverse the children of the current root
    for (let child of root.children) {
        // The subtree whose root is the current child is traversed by
        // yielding control to another instance of the generator
        yield* traverseDomWithGenerator(child);
    }
}

/**
 * Tests.
 */
describe("DOM Traversal", function () {
    it('illustrates recursive DOM traversal', function () {
        let dom_subtree_desc = createDomSubtree();
        let subtree = dom_subtree_desc.dom_subtree;
        let expected_traversal_order = dom_subtree_desc.traversal_order;
        let counter = 0;

        traverseDom(subtree, function (element) {
            expect(element.tagName.toLowerCase()).toEqual(expected_traversal_order[counter++]);
        });
    });

    it('illustrates DOM traversal via generator function', function () {
        let dom_subtree_desc = createDomSubtree();
        let subtree = dom_subtree_desc.dom_subtree;
        let expected_traversal_order = dom_subtree_desc.traversal_order;
        let counter = 0;

        for (let element of traverseDomWithGenerator(subtree)) {
            expect(element.tagName.toLowerCase()).toEqual(expected_traversal_order[counter++]);
        }
    });
});