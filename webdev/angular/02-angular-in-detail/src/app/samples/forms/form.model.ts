/**
 * Classes that represent the underlying form model used to generate forms elements
 * and validate the form.
 */

import {FormGroup, FormControl, Validators } from "@angular/forms";
import { GreaterThanFormValidator } from "./greaterthan.formvalidator";

/* Corresponds to a single Product form control (such as category input) */
export class ProductFormControl extends FormControl {
  /* The text within the label associated with the given form control. */
  label: string;

  /* The Product property this form control corresponds to. */
  modelProperty: string;

  constructor(label: string, property: string, value: any, validator: any) {
    super(value, validator);
    this.label = label;
    this.modelProperty = property;
  }

  getFieldValidationMessages(): Array<string> {
    let validationMsgs: Array<string> = [];

    if (this.errors) {
      // Can use for..in loop to iterate over own properties of ngModelObj.errors object
      for (let prop of Object.keys(this.errors)) {
        switch (prop) {
          case "required":
            validationMsgs.push(`A ${this.modelProperty} must be provided.`);
            break;

          case "pattern":
            validationMsgs.push(`The ${this.modelProperty} contains some invalid characters.`);
            break;

          case "minlength":
            validationMsgs.push(`The ${this.modelProperty} must be at least ${this.errors.minlength.requiredLength} characters long.`);
            break;

          case "maxlength":
            validationMsgs.push(`The ${this.modelProperty} mustn't be longer than ${this.errors.maxlength.requiredLength} characters.`);
            break;

          case "min":
            validationMsgs.push(`The ${this.modelProperty} must not be lower than ${this.errors.min.min}.`);
            break;

          case "max":
            validationMsgs.push(`The ${this.modelProperty} must not be greater than ${this.errors.max.max}.`);
            break;

          case "greaterThan":
            // This is a custom validator
            validationMsgs.push(`The ${this.modelProperty} must be a number greater than ${this.errors.greaterThan.min}.`);
            break;

          default:
            throw `Unexpected validation object property ${prop}`;
        }
      }
    }
    return validationMsgs;
  }
}

/* Corresponds to an entire Product form */
export class ProductFormGroup extends FormGroup {
  constructor() {
    /**
     * The object passed to the FormGroup constructor describes the form. Each property
     * corresponds to a form control/field and the property's value is an object of
     * ProductFormControl type which describes the given form control/field (including
     * the validator to which form control values must adhere to).
     *
     * @note The properties of the object passed to the FormGroup constructor correspond
     * to the form controls' HTML name attribute. For example, Angular assumes that the
     * form's input control with name='category' is associated with the 'category' property
     * of the object passed to the FormGroup constructor.
     */
    super({
      name: new ProductFormControl("Name", "name", "", Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("^[A-Za-z0-9 ]+$")
      ])),
      category: new ProductFormControl("Category", "category", "", Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("^[A-Za-z0-9 ]+$")
      ])),
      price: new ProductFormControl("Price", "price", 0, Validators.compose([
        Validators.required,
        GreaterThanFormValidator.GreaterThan(0)
      ]))
    });
  }

  /* Builds and returns an array of controls/fields in the form. Used to automate form rendering. */
  getProductFormControls(): Array<ProductFormControl> {
    /* The controls are of ProductFormControl type, so indicating this to TypeScript is safe. */
    return Object.keys(this.controls)
      .map(prop => this.controls[prop] as ProductFormControl);
  }

  getFormValidationMessages(): Array<string> {
    let validationMsgs: Array<string> = [];
    for (let formCtrl of this.getProductFormControls()) {
      validationMsgs.push(...formCtrl.getFieldValidationMessages());
    }
    return validationMsgs;
  }
}
