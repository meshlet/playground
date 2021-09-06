/**
 * Structural directive implementing the same functionality as the built-in
 * ngIf directive.
 *
 * @note This (and the built-in ngIf) directive adds/removes the content from the
 * DOM tree on each change of the condition. This is relatively costly operation,
 * and it might be more efficient to hide/show the content using the `display`
 * and/or `visibility` CSS properties (depending on whether one wants the content
 * to be invisible but still occupy space in the document, or be invisible and
 * also not occupy any space).
 */

import { Directive, Input, SimpleChange, ViewContainerRef, TemplateRef } from "@angular/core";

@Directive({
  selector: "[appIfDir]"
})
export class IfDirective {
  /**
   * ViewContainerRef object corresponds to the ng-template element and is used to
   * insert content (or views) in the HTML document.
   *
   * TemplateRef object corresponds to the content of the ng-template element, so
   * this is HTML content that will be inserted in the HTML document in case IF
   * condition is true. Note that this template can be inserted multiple times
   * within the view container and context object can be passed when inserting
   * each view. Check for.directive.ts for example of this.
   */
  constructor(private container: ViewContainerRef, private template: TemplateRef<Object>) {
  }

  @Input("appIfDir")
  condition: boolean = false;

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    const change = changes["condition"];
    if (!change.currentValue) {
      this.container.clear();
    }
    else{
      this.container.createEmbeddedView(this.template);
    }
  }
}
