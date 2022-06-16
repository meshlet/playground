import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import PasswordValidator from 'password-validator';

/**
 * Setup the password validator.
 *
 * @todo This is now copied from the server. Better solution would be
 * to simply extract the code into a separate TS script shared between
 * client and server.
 */
const passwordValidatorSchema = new PasswordValidator();
passwordValidatorSchema
  .is().min(10)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()
  .has().symbols();

/**
 * Directive implementing password validation.
 */
@Directive({
  selector: '[appPasswordValidator][formControlName],[appPasswordValidator][formControl],[appPasswordValidator][ngModel]',
  providers: [{
    provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordValidatorDirective), multi: true
  }]
})
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return typeof control.value === 'string' && passwordValidatorSchema.validate(control.value)
      ? null
      : { password: false };
  }
}
