/**
 * @note For a more verbose implementation of custom directive which allows creating
 * two-way binding on host element see two-way-binding.directive.ts.
 *
 * The following directive allows creating two-way binding on the host input element. The
 * following example explains how it works:
 *
 * <input type="text" id="input1" class="form-control"
 *        [appSimplifiedTwoWayBindingDir]="componentProperty"
 *        (appSimplifiedTwoWayBindingDirChange)="componentProperty = $event;">
 *
 * <input type="text" id="input2" class="form-control"
 *        [appSimplifiedTwoWayBindingDir]="componentProperty"
 *        (appSimplifiedTwoWayBindingDirChange)="componentProperty = $event;">
 *
 * Let's assume that user enters the character "a" in `input1` field. The sequence of actions is as
 * follows:
 *
 * 1) `input` event is triggered on the `input1` field, which leads to execution of the
 *    directive's `emitCustomEvent` method which emits the custom `appSimplifiedTwoWayBindingDirChange`
 *    event
 * 2) Emitting the `appSimplifiedTwoWayBindingDirChange` event causes the `input1`'s
 *    (appSimplifiedTwoWayBindingDirChange)="newProduct.name = $event;" expression (that is the
 *    `appSimplifiedTwoWayBindingDirChange` event listener) to be executed, which updates the
 *    `componentProperty`.
 * 3) As a result of `componentProperty` update, Angular will evaluate (as part of change detection
 *    triggered by the `appTwoWayBindingDirChange` event) affected data-bindings which are
 *    the two [appSimplifiedTwoWayBindingDirChange]="componentProperty" bindings in `input1` and `input2`
 *    fields.
 * 4) Angular will then assign the new value of `componentProperty` to the `appSimplifiedTwoWayBindingDir / inputProp`
 *    input property belonging to the directives corresponding to both `input1` and `input2` fields.
 * 5) As directive's `appSimplifiedTwoWayBindingDir / inputProps` is bound to the host element's
 *    `value` property (via the @HostBinding decorator), Angular will update the host element's
 *    `value` property with the new value of the `inputProp` input property (this will happen for
 *    both `input1` and `input2` fields), setting both to the character "a".
 *
 * @note The template code using this directive can be simplified using the banana-in-the-box [()] syntax:
 *
 * <input type="text" id="input1" class="form-control" [(appSimplifiedTwoWayBindingDir)]="componentProperty">
 *
 * When Angular encounters the [(someBinding)] syntax, it expects to find an input property named
 * `someBinding` as well as output property (or event property) named `someBindingChange` in the
 * given directive. It will then expand this banana-in-the-box syntax to:
 *
 * <input type="text" id="input1" class="form-control"
 *        [appSimplifiedTwoWayBindingDir]="componentProperty"
 *        (appSimplifiedTwoWayBindingDirChange)="componentProperty = $event;">
 */

import {Directive, Input, Output, EventEmitter, HostBinding, HostListener, SimpleChange} from "@angular/core";

@Directive({
  /**
   * Matches input elements that have the `appSimplifiedTwoWayBindingDir` attribute.
   */
  selector: "input[appSimplifiedTwoWayBindingDir]"
})
export class SimplifiedTwoWayBindingDirective {
  /**
   * Input property used to create a data binding. The @HostBinding decorator binds the
   * input property to the host element's `value` property, so that whenever input property
   * changes the host element's `value` (input field's content) is updated as well.
   */
  @Input("appSimplifiedTwoWayBindingDir")
  @HostBinding("value")
  inputProp: number = 0;

  /**
   * The output property use to register event listener in the template and emit events
   * from the directive.
   */
  @Output("appSimplifiedTwoWayBindingDirChange")
  change = new EventEmitter<number>();

  /**
   * Invoked whenever the `input` event is triggered on the host element. It emits
   * the custom `appSimplifiedTwoWayBindingDirChange` event which results in evaluating the
   * (appSimplifiedTwoWayBindingDirChange)="" expression on the host element if any such
   * expression exists (in other words, it executes event handler if one is
   * registered on the host element).
   *
   * @note The second argument to @HostListener decorator is the array of arguments
   * that should be provided to the event handler. In this case the only argument is
   * the value of the event target, which will be the content of the input (host)
   * element this directive instance is bound to.
   */
  @HostListener("input", ["$event.target.value"])
  emitCustomEvent(newValue: number) {
    this.change.emit(newValue);
  }
}
