/**
 * Illustrates using the @ContentChild which tells Angular to query the host
 * element's content for the specified directive and assign the first result
 * of the query to the property annotated with the @ContentChild decorator.
 */

import {Directive, HostBinding, Input, ContentChild, SimpleChange} from "@angular/core";

/**
 * This is a simple directive applied to paragraph host element, expected to
 * be placed within DIVs and is queried by the @ContentChild decorator. See
 * classes below for usage of this decorator.
 */
@Directive({
  selector: "p[appContentChildInnerDir]",
  exportAs: "appContentChildInnerDir"
})
export class ContentChildInnerDirective {
  @HostBinding("class")
  bgClass: string = "";

  setDarkBg(dark: boolean) {
    this.bgClass = dark ? "bg-dark text-white" : "";
  }
}

/**
 * The following directive uses @ContentChild decorator to query it's host element's
 * content searching for an element with the ContentChildInnerDirective directive
 * applied. Decorator returns the first such directive, if it exists. For the
 * following HTML:
 *
 * <div [appContentChildSearchByDirClassOuterDir]="aBooleanExpression">
 *   <p appContentChildInnerDir></p>
 *   <p appContentChildInnerDir></p>
 * </div>
 *
 * @ContentChild(ContentChildInnerDirective) will return the ContentChildInnerDirective
 * instance bound to the first paragraph element.
 *
 * @note Querying directives by directive class type is one of the ways @ContentChild
 * can find directives. See the class below for another query mechanism.
 *
 * @note Angular executes the content query just before it invokes the `ngAfterContentInit`
 * directive method. This means that content query result is not available when ngOnChanges
 * is called the first time. Because of this, DOM update must happen in the ngAfterContentInit
 * to make sure that the state of the `darkBg` input property is aligned with the DOM
 * state. Otherwise, these two might be unaligned before second ngOnChanges invocation.
 */
@Directive({
  selector: "div[appContentChildSearchByDirClassOuterDir]"
})
export class ContentChildSearchByDirClassOuterDir {
  @Input("appContentChildSearchByDirClassOuterDir")
  darkBg: boolean = false;

  @ContentChild(ContentChildInnerDirective)
    // @ts-ignore
  childDirective: ContentChildInnerDirective;

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if (this.childDirective) {
      this.childDirective.setDarkBg(this.darkBg);
    }
  }

  ngAfterContentInit() {
    if (this.childDirective) {
      this.childDirective.setDarkBg(this.darkBg);
    }
  }
}

/**
 * This directive illustrates using @ContentChild decorator to query directives
 * using template reference variable names. The syntax is @ContentChild("templateVariable")
 * which will search for a template variable called `templateVariable` and will
 * return the directive assigned to it. For the following HTML
 *
 * <div [appContentChildSearchByDirClassOuterDir]="aBooleanExpression">
 *   <p appContentChildInnerDir #tmplVar="appContentChildInnerDir"></p>
 *   <p appContentChildInnerDir></p>
 * </div>
 *
 * @ContentChild("tmplVar") returns the ContentChildInnerDirective instance assigned
 * to the #tmplVar template reference variable.
 */
@Directive({
  selector: "div[appContentChildSearchByTmplVarNameOuterDir]"
})
export class ContentChildSearchByTmplVarNameOuterDir {
  @Input("appContentChildSearchByTmplVarNameOuterDir")
  darkBg: boolean = false;

  @ContentChild("tmplVar")
    // @ts-ignore
  childDirective: ContentChildInnerDirective;

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if (this.childDirective) {
      this.childDirective.setDarkBg(this.darkBg);
    }
  }

  ngAfterContentInit() {
    if (this.childDirective) {
      this.childDirective.setDarkBg(this.darkBg);
    }
  }
}
