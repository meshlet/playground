/**
 * Illustrates using classical HTML Forms with Angular including different
 * ways of form validation.
 */

import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Repository } from "../../repository.model";
import { Product } from "../../product.model";

@Component({
  selector: "template-based-forms",
  templateUrl: "template-based-forms.component.html"
})
export class TemplateBasedFormsComponent {
  repository: Repository = new Repository();
  newProduct: Product = new Product();

  getProductJson(): string {
    return JSON.stringify(this.newProduct);
  }

  getFieldValidationMessages(field: any, fieldName: string = ""): Array<string> {
    fieldName = fieldName || field.path;
    let validationMsgs: Array<string> = [];

    if (field.invalid) {
      // Can use for..in loop to iterate over own properties of ngModelObj.errors object
      for (let prop of Object.keys(field.errors)) {
        switch (prop) {
          case "required":
            validationMsgs.push(`A ${fieldName} must be provided.`);
            break;

          case "pattern":
            validationMsgs.push(`The ${fieldName} contains some invalid characters.`);
            break;

          case "minlength":
            validationMsgs.push(`The ${fieldName} must be at least ${field.errors.minlength.requiredLength} characters long.`);
            break;

          case "maxlength":
            validationMsgs.push(`The ${fieldName} mustn't be longer than ${field.errors.maxlength.requiredLength} characters.`);
            break;

          case "min":
            validationMsgs.push(`The ${fieldName} must not be lower than ${field.errors.min.min}.`);
            break;

          case "max":
            validationMsgs.push(`The ${fieldName} must not be greater than ${field.errors.max.max}.`);
            break;

          default:
            console.log(field.errors);
            throw `Unexpected validation object property ${prop}`;
        }
      }
    }
    return validationMsgs;
  }

  getFormValidationMessages(form: NgForm): Array<string> {
    let validationMsgs: Array<string> = [];
    for (let ctrlName of Object.keys(form.controls)) {
      validationMsgs.push(...this.getFieldValidationMessages(form.controls[ctrlName], ctrlName));
    }
    return validationMsgs;
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);
      this.newProduct = new Product();
      form.resetForm();
    }
  }
}
