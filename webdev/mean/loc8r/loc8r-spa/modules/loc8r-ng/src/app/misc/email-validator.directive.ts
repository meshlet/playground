import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Directive implementing email validation.
 *
 * @todo Consider moving this into a dedicated validator NgModule.
 */
@Directive({
  selector: '[appEmailValidator][formControlName],[appEmailValidator][formControl],[appEmailValidator][ngModel]',
  providers: [{
    provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidatorDirective), multi: true
  }]
})
export class EmailValidatorDirective implements Validator {
  private static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validate(control: AbstractControl): ValidationErrors | null {
    return typeof control.value === 'string' && EmailValidatorDirective.emailRegex.test(control.value)
      ? null
      : { email: false };
  }
}
