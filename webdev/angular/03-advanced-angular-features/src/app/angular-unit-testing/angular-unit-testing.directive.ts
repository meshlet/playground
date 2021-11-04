import {
  Directive, ElementRef, Attribute, Input, SimpleChange, OnChanges
} from "@angular/core";

/**
 * A simple directive used to illustrate unit-testing directives in
 * angular-unit-testing.directive.spec.ts.
 */
@Directive({
  selector: "[simple-attr-dir]"
})
export class SimpleAttributeDirective implements OnChanges{
  constructor(private element: ElementRef) {
  }

  @Input("simple-attr-dir")
  bgClass: string = "";

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change = changes["bgClass"];
    let classList = this.element.nativeElement.classList;
    if (!change.isFirstChange() && classList.contains(change.previousValue)) {
      classList.remove(change.previousValue);
    }
    if (!classList.contains(change.currentValue)) {
      classList.add(change.currentValue);
    }
  }
}
