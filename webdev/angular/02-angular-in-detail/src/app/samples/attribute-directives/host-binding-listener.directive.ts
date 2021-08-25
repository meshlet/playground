/**
 * A directive that uses @HostBinding and @HostListener to define bindings on
 * the host element. @HostBinding("property") sets up binding between the
 * host element's `property` and whatever property the decorator is applied
 * to. In other words, changing the value of the decorator's input property
 * will update the element's property as well. @HostListener("someEvent") is
 * applied to a method and makes sure that that method is invoked whenever
 * `someEvent` event is triggered.
 *
 * These decorators can be used to write directives which don't rely on DOM
 * API, making it possible to use them outside browser environment (e.g.
 * if running in browser, Angular will use DOM API to setup event callback
 * when @HostListener decorator is used. But if run outside browser, it will
 * use other means to do that).
 */

import {Directive, Input, Output, EventEmitter, HostBinding, HostListener} from "@angular/core";
import { Product } from "../../product.model";

@Directive({
  selector: "[appHostBindingListenerDir]"
})
export class HostBindingListenerDirective {
  /**
   * The input property used to assign host element to CSS classes. The @HostBinding("class")
   * decorator binds the element's class property with the directives bgClass property, so
   * that whenever bgClass changes the element's classes are updated as well.
   *
   * @note The order of decorators is important. The meaning is that whenever `appHostBindingListenerDir`
   * input property changes, the host's class property is updated.
   *
   * @note Using @HostBinding avoids the need to set elements CSS classes manually, removing
   * the dependency on the DOM API.
   */
  @Input("appHostBindingListenerDir")
  @HostBinding("class")
  bgClass: string = "";

  /**
   * Input property used to pass the Product instance to the directive
   */
  @Input("appHostBindingListenerDirProduct")
  product: Product | undefined = undefined;

  /**
   * The output property which is used by the template to listen for the events using
   * the (appHostBindingListenerDirClick)="" syntax. Whenever directive emits the event, the
   * (appHostBindingListenerDirClick) expression gets evaluated.
   */
  @Output("appHostBindingListenerDirClick")
  click = new EventEmitter<Product>();

  /**
   * Applying @HostListener("click") decorator to the method will make sure the method is
   * invoked each time the user clicks on the host element.
   *
   * @note Using @HostListener avoids the need to attach the click event listener via the
   * DOM API, making it possible to run this code outside the browser.
   */
  @HostListener("click")
  emitCustomEvent() {
    if (this.product) {
      this.click.emit(this.product);
    }
  }
}
