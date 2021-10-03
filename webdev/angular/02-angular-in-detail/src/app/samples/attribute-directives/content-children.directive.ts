/**
 * Illustrates the @ContentChildren decorator that instructs Angular to query the
 * host element's content for instances of the specified directive and assign the
 * list of obtained directives to the property decorated with @ContentChildren.
 */

import {
  Directive, HostBinding, Input, ContentChildren, QueryList, SimpleChange, ContentChild,
  Component
} from "@angular/core";

/**
 * This is a simple directive whose purpose is to be queried by the @ContentChildren
 * decorator. See classes below for usage of this decorator.
 */
@Directive({
  selector: "[appContentChildrenInnerDir]"
})
export class ContentChildrenInnerDirective {
  @HostBinding("class")
  bgClass: string = "";

  setDarkBg(dark: boolean) {
    this.bgClass = dark ? "bg-dark text-white" : "";
  }
}

/**
 * This directive uses @ContentChildren to query it's host element's content
 * and search for all instances of the ContentChildrenInnerDirective directive,
 * which are assigned to the `childDirectives` property. Note that this
 * property is not an Array but a special built-in type `QueryList` which
 * is the type returned by the @ContentChildren.
 *
 * Also note that @ContentChildren decorator has a second argument, an object
 * whose `descendants` property is set to true. This means that @ContentChildren
 * will recursively search all DOM subtrees of the host element's children for
 * the ContentChildrenInnerDirective directives, not only its immediate children.
 *
 * @note Check the ContentChildrenSearchScopeComponent component below to understand
 * what a content child actually is and what is the search scope for @ContentChild
 * and @ContentChildren directives.
 *
 * @note For more on `ngAfterContentInit` see content-child.directive.ts.ß
 */
@Directive({
  selector: "[appContentChildrenIncludeDescendentsOuterDir]"
})
export class ContentChildrenIncludeDescendentsOuterDir {
  @Input("appContentChildrenIncludeDescendentsOuterDir")
  darkBg: boolean = false;

  @ContentChildren(ContentChildrenInnerDirective, { descendants: true })
    // @ts-ignore
  childDirectives: QueryList<ContentChildrenInnerDirective>;

  updateChildDirectives() {
    if (this.childDirectives) {
      // Iterate over directives found by the @ContentChildren decorator and
      // set/unset dark background for each (or their respective host elements)
      this.childDirectives.forEach(directive => {
        directive.setDarkBg(this.darkBg);
      });
    }
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    this.updateChildDirectives();
  }

  ngAfterContentInit() {
    this.updateChildDirectives();
  }
}

/**
 * The following component illustrates the search scope of the @ContentChildren
 * decorator. This decorator searches only the content of the element where the
 * corresponding directive (that uses @ContentChildren to query to content) is
 * applied. Let's assume that the directive using the @ContentChildren has the
 * selector set to 'directiveUsingContentChildrenDecorator' while the directive
 * to be queried has the selector set to 'directiveToBeQueried'.
 *
 * The component's host element is written as follows:
 *
 * <component-host-elem directiveUsingContentChildrenDecorator>
 *   <p directiveToBeQueried>Paragraph 1</p>
 * </component-host-elem>
 *
 * and the component's template is written as follows:
 *
 * <ng-content></ng-content>
 * <div>
 *   <p directiveToBeQueried>Paragraph 2</p>
 * </div>
 *
 * Because the @ContentChildren decorator queries only the contents of the element
 * to which the directive is applied (in this case the directiveUsingContentChildrenDecorator
 * directive), the content query will match only the `Paragraph 1` but not the `Paragraph 2`
 * within the component's template. In other words, @ContentChildren as well as @ContentChild
 * decorators query directives in the content projected using the ng-content element.
 *
 * @note According to the description above, a content child of an element A is any element that
 * is found in the contents of element A. This excludes elements found in the template of a
 * component. Elements in the template are view children and are queried using the @ViewChild
 * and @ViewChildren directives that ignoring the content of the component's host element (i.e.
 * content projected with ng-content. For example of this check
 * components-in-detail/product-table.component.ts.
 */
@Component({
  selector: "content-children-search-scope",
  template:`
      <p appContentChildrenInnerDir>
          This paragraph is an immediate child of the host element to which the
          appContentChildrenIncludeDescendentsOuterDir directive is applied.
      </p>
      <div>
          <div>
              <p appContentChildrenInnerDir>
                  This is paragraph is not an immediate child of the HTML host element to which
                  the appContentChildrenIncludeDescendentsOuterDir directive is applied.
              </p>
              <!-- This is the host element's (content-children-and-projected-content) content -->
              <!-- (projected content) -->
              <ng-content></ng-content>
          </div>
      </div>`
})
export class ContentChildrenSearchScopeComponent {
  public checkboxChecked = true;
}

/**
 * This directive illustrates how to subscribe to changes in the content query. The
 * result of the content query (the list of directives returned by the @ContentChildren)
 * is live, meaning an event is triggered each time some directives are removed and
 * or added to the collection (or better said, every time their corresponding HTML
 * elements are removed and/or added).
 *
 * The callback is registered in ngAfterContentInit, at which point the initial
 * content query has been resolved and `childDirectives` property has been initialized.
 * With the callback registered, each change in the DOM that affects the content query
 * results in the DOM update (in this case, the corresponding elements' background will
 * be correctly set as soon as they are added to the DOM and if any elements are removed
 * other elements' background will be corrected accordingly).
 */
@Directive({
  selector: "[appContentChildrenListenForContentChangesOuterDir]"
})
export class ContentChildrenListenForContentChangesOuterDir {
  @Input("appContentChildrenListenForContentChangesOuterDir")
  darkBg: boolean = false;

  @ContentChildren(ContentChildrenInnerDirective)
    // @ts-ignore
  childDirectives: QueryList<ContentChildrenInnerDirective>;

  updateChildDirectives() {
    if (this.childDirectives) {
      // Iterate over directives found by the @ContentChildren decorator and
      // set/unset dark background for each (or their respective host elements)
      this.childDirectives.forEach((directive, index) => {
        directive.setDarkBg(this.darkBg && (index % 2 == 0));
      });
    }
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    this.updateChildDirectives();
  }

  ngAfterContentInit() {
    // Run the update immediately to make sure that the state of darkBg input
    // property (which might be set to true) is in sync with styling of the
    // HTML elements. Note that this update won't happen when first ngOnChanges
    // is called as content query has not been resolved yet so QueryList is
    // undefined. Hence, without this call here the darkBg input property and
    // DOM might be out of sync until the next ngOnChanges call.
    this.updateChildDirectives();

    // Register the callback to update the element's background when content
    // query changes (i.e. matching directives added and/or removed from the
    // host element's content)
    this.childDirectives.changes.subscribe(() => {
      // This callback is executed as part of the content update after Angular
      // has evaluated the data bindings (including the data bindings for the
      // child directives). Hence, making changes that would result in data
      // bindings returning different values after this callback returns is
      // prohibited by Angular and will cause an error in Debug runs. Starting
      // another content update must not happen until the one in progress has
      // been completed, hence we're performing the update asynchronously
      // with a timeout.
      setTimeout(() => {
        this.updateChildDirectives();
      }, 0);
    });
  }
}
