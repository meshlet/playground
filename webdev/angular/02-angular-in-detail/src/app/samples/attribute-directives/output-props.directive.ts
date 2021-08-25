/**
 * A directive that uses output properties to allow user to add custom events to
 * the host element. Once the user clicks on the host element, the callback
 * registered by the directive emits a custom event which can be reacted to
 * in the template by using (appOutputPropsDirClick) event binding. Note that
 * directive also exposes an input property that should be used by the template
 * to pass the Product object associated with the host element (which in this
 * case will be <tr> element which displays the product).
 */

import {Directive, ElementRef, Input, Output, EventEmitter} from "@angular/core";
import { Product } from "../../product.model";

@Directive({
  selector: "[appOutputPropsDir]"
})
export class OutputPropsDirective {
  constructor(hostElemRef: ElementRef) {
    // Bind the event listener to the click event of the host element
    (hostElemRef.nativeElement as HTMLElement).addEventListener("click", () => {
      // Emit the event via the EventEmitter property marked with @Output decorator
      // NOTE: it is safe to access `product` property in the scope of this callback, because
      // all input properties are initialized before this callback can be executed. This includes
      // evaluating data binding expressions and assigning values to input properties
      if (this.product) {
        // Don't emit event if product wasn't set by the template
        this.click.emit(this.product);
      }
    });
  }

  /**
   * Input property used to pass the Product instance to the directive
   */
  @Input("appOutputPropsDir")
  product: Product | undefined = undefined;

  /**
   * The output property which is used by the template to listen for the events using
   * the (appOutputPropsDirClick)="" syntax. Whenever directive emits the event, the
   * (appOutputPropsDirClick) expression gets evaluated.
   */
  @Output("appOutputPropsDirClick")
  click = new EventEmitter<Product>();
}
