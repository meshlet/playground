/**
 * A directive that uses data-bound input properties to receive data. Input properties
 * are more powerful than attribute directives because they can use JS expression
 * to generate their values, which are dynamic and react on changes in the model
 * and rest of the application. Using input properties basically creates a data
 * binding.
 */

import { Directive, ElementRef, Input, SimpleChange } from "@angular/core";

@Directive({
  selector: "[appInputPropsDir]"
})
export class InputPropsDirective {
  private hostElem: HTMLElement;

  constructor(hostElemRef: ElementRef) {
    this.hostElem = hostElemRef.nativeElement as HTMLElement;
  }

  /**
   * Input properties are declared by applying the @Input decorator. This decorator
   * accepts a string argument which determines the name of the HTML attribute which
   * is bound to this property. In case no argument is provided, Angular assumes that
   * attribute's name will match the name of the property @Input is applied to.
   *
   * @note Input properties are initialized after the directive object has been created.
   * That's why one cannot access the input property's value in the constructor (ngOnInit
   * can be used for that purpose).
   */
  @Input("appInputPropsDir")
  bgClass: string = "";

  /**
   * @note ngOnInit is called once after directive's constructor is run and all it's
   * input properties are initialized.
   */
  ngOnInit() {
    this.hostElem.classList.add(this.bgClass || "bg-success", "text-white");
  }

  /**
   * @note ngOnChanges is called every time the value of an input property changes. It
   * is also called once just before ngOnInit is invoked.
   */
  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    const change = changes["bgClass"];

    // Make sure this is not the first change, in which case ngOnInit will handle
    // the class initialization
    if (!change.isFirstChange()) {
      // Remove element from the previous and add it to the new class. Don't bother
      // checking if element is part of the class - as long as we remove/add every
      // time something changes, classes will remain consistent.
      this.hostElem.classList.remove(change.previousValue);
      this.hostElem.classList.add(change.currentValue);
    }
  }
}
