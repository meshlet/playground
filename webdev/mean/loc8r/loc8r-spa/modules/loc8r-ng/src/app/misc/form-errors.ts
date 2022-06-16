import { NgModel } from '@angular/forms';
import { isRecord } from 'loc8r-common/common.module';

export class FormErrors {
  /**
   * Extracts the form control error from the ngModel object if any,
   * otherwise returns undefined.
   *
   * @todo This will currently return only the first error even though
   * there might be more.
   */
  getFormCtrlError(model: NgModel, fieldName = '') {
    if (model.invalid && model.errors) {
      if (fieldName === '' && model.path.length > 0) {
        fieldName = model.path[model.path.length - 1];
      }

      for (const prop in model.errors) {
        switch (prop) {
          case 'required': {
            return `${fieldName} must be provided.`;
          }
          case 'minlength': {
            const minLength = model.errors.minlength as unknown;
            if (isRecord(minLength) && (typeof minLength.requiredLength === 'string' || typeof minLength.requiredLength === 'number')) {
              return `${fieldName} must be at least ${minLength.requiredLength} characters.`;
            }
            break;
          }
          case 'maxlength': {
            const maxLength = model.errors.maxlength as unknown;
            if (isRecord(maxLength) && (typeof maxLength.requiredLength === 'string' || typeof maxLength.requiredLength === 'number')) {
              return `${fieldName} must not be at longer than ${maxLength.requiredLength} characters.`;
            }
            break;
          }
          case 'pattern': {
            return `${fieldName} contains invalid characters.`;
          }
          case 'password': {
            return `${fieldName} is not a valid password. Password must be at least 10 characters long, have at least uppercase and lowercase letter, have at least one digit, have at least one symbol character and must not contain whitespace characters`;
          }
          default: {
            console.warn(`${prop} validator property is not handled.`);
            return `${fieldName} field value is invalid.`;
          }
        }
      }
    }
    return undefined;
  }
}
