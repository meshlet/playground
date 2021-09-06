/**
 * Illustrates the @ContentChildren decorator that instructs Angular to query the
 * host element's content for instances of the specified directive and assign the
 * list of obtained directives to the property decorated with @ContentChildren.
 */

import {Directive, HostBinding, Input, ContentChildren, QueryList, SimpleChange, ContentChild} from "@angular/core";

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
