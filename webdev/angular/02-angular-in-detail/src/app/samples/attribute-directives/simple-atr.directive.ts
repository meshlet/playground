/**
 * A very simple attribute directive that applies adds the host DOM element to
 * some CSS classes.
 */

import { Directive, ElementRef } from "@angular/core";

@Directive({
  // The square brackets indicates that this is a CSS attribute selector that will
  // match any element (regardless of its type) that has the `appSimpleDir`
  // attribute.
  selector: "[appSimpleDir]"
})
export class SimpleAtrDirective {
  constructor(hostElem: ElementRef) {
    (hostElem.nativeElement as HTMLElement).classList.add("bg-success", "text-white");
  }
}
