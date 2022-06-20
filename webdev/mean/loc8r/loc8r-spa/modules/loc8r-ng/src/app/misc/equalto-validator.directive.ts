import { Directive, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/**
 * A helper that contructs an equalTo validator function.
 */
function constructEqualToValidator(refControl: AbstractControl): ValidatorFn {
  let subscribed = false;
  return (control: AbstractControl) => {
    if (!subscribed) {
      subscribed = true;

      // We need to subscribe to reference control value changes, in order
      // to run the validation on our own control. Angular will run this
      // validator itself when user changes the value of the control itself,
      // but not when the value of the reference control changes.
      refControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }

    return refControl.value === control.value
      ? null
      : { equalTo: { refControl: refControl } };
  };
}

/**
 * Directive implementing an equal to validator.
 *
 * This validator checks whether the control the directive is
 * bound to has the same value as the control passed via the
 * input property.
 *
 * @todo Consider moving this into a dedicated validator NgModule.
 */
@Directive({
  selector: '[appEqualToValidator][formControlName],[appEqualToValidator][formControl],[appEqualToValidator][ngModel]',
  providers: [{
    provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualToValidatorDirective), multi: true
  }]
})
export class EqualToValidatorDirective implements Validator, OnInit, OnChanges {
  private validator?: ValidatorFn;

  /**
   * Input property used to pass in the reference control, i.e.
   * the control whose value we'll compare to.
   */
  @Input('appEqualToValidator')
  refControl?: AbstractControl;

  ngOnInit(): void {
    if (this.refControl) {
      // Construct the validator
      this.validator = constructEqualToValidator(this.refControl);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newRefControl = changes.refControl;
    if (newRefControl instanceof AbstractControl) {
      // Construct a new validator based on the new reference control
      this.validator = constructEqualToValidator(newRefControl);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator ? this.validator(control) : null;
  }
}
