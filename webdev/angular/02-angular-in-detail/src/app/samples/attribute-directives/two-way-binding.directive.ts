/**
 * The following directive allows creating two-way binding on the host input element. The
 * following example explains how it works:
 *
 * <input type="text" id="input1" class="form-control"
 *        [appTwoWayBindingDir]="componentProperty" (appTwoWayBindingDirChange)="componentProperty = $event;">
 *
 * <input type="text" id="input2" class="form-control"
 *        [appTwoWayBindingDir]="componentProperty" (appTwoWayBindingDirChange)="componentProperty = $event;">
 *
 * Let's assume that user enters the character "a" in `input1` field. The sequence of actions is as
 * follows:
 *
 * 1) `input` event is triggered on the `input1` field, which leads to execution of the
 *    directive's `emitCustomEvent` method which emits the custom `appTwoWayBindingDirChange`
 *    event
 * 2) Emitting the `appTwoWayBindingDirChange` event causes the `input1`'s
 *    (appTwoWayBindingDirChange)="newProduct.name = $event;" expression (that is the `appTwoWayBindingDirChange`
 *    event listener) to be executed, which updates the `componentProperty`.
 * 3) As a result of `componentProperty` update, Angular will evaluate (as part of change detection
 *    triggered by the `appTwoWayBindingDirChange` event) affected data-bindings which are
 *    the two [appTwoWayBindingDir]="componentProperty" bindings in `input1` and `input2` fields.
 * 4) Angular will then assign the new value of `componentProperty` to the `appTwoWayBindingDir / inputProp`
 *    input property belonging to the directives corresponding to both `input1` and `input2` fields.
 * 5) Next, due to the changes in the directive's input property, Angular will execute
 *    `ngOnChanges` method on both `input1`'s and `input2`'s directives which will in turn update
 *    the directives' `appTwoWayBindingDir / inputProp`.
 * 6) Finally, as `appTwoWayBindingDir / inputProp` is bound to the host element's `value` property, Angular will update
 *    the `value` property  of both `input1` and `input2` setting both to the character "a".
 *
 * @note The template code using this directive can be simplified using the banana-in-the-box [()] syntax:
 *
 * <input type="text" id="input1" class="form-control" [(appTwoWayBindingDir)]="componentProperty">
 *
 * When Angular encounters the [(someBinding)] syntax, it expects to find an input property named
 * `someBinding` as well as output property (or event property) named `someBindingChange` in the
 * given directive. It will then expand this banana-in-the-box syntax to:
 *
 * <input type="text" id="input1" class="form-control"
 *        [appTwoWayBindingDir]="componentProperty" (appTwoWayBindingDirChange)="componentProperty = $event;">
 *
 * @note For a simplified custom directive that implements two-way binding check two-way-binding-simplified.directive.ts.
 */

import {Directive, Input, Output, EventEmitter, HostBinding, HostListener, SimpleChange} from "@angular/core";

@Directive({
  /**
   * Matches input elements that have the `appTwoWayBindingDir` attribute.
   */
  selector: "input[appTwoWayBindingDir]"
})
export class TwoWayBindingDirective {
  /**
   * Input property used to create a data binding.
   */
  @Input("appTwoWayBindingDir")
  inputProp: string = "";

  /**
   * Bind directive's `fieldValue` property to host element's `value` property, so that whenever
   * `fieldValue` changes the input's content is updated.
   */
  @HostBinding("value")
  fieldValue: string = "";

  /**
   * Whenever directive's `inputProp` changes, this method will update the directive's
   * `fieldValue` property and as a result the input's `value` property
   */
  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    const change = changes["inputProp"];
    this.fieldValue = change.currentValue;
  }

  /**
   * The output property use to register event listener in the template and emit events
   * from the directive.
   */
  @Output("appTwoWayBindingDirChange")
  change = new EventEmitter<string>();

  /**
   * Invoked whenever the `input` event is triggered on the host element. It emits
   * the custom `appTwoWayBindingDirChange` event which results in evaluating the
   * (appTwoWayBindingDirChange)="" expression on the host element if any such
   * expression exists (in other words, it executes event handler if one is
   * registered on the host element).
   *
   * @note The second argument to @HostListener decorator is the array of arguments
   * that should be provided to the event handler. In this case the only argument is
   * the value of the event target, which will be the content of the input (host)
   * element this directive instance is bound to.
   */
  @HostListener("input", ["$event.target.value"])
  emitCustomEvent(newValue: string) {
    this.change.emit(newValue);
  }
}
