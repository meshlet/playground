/**
 * Illustrates Angular's Reactive (or model-based) forms, in which the form details and its
 * validation is defined in the component instead of the HTML.
 */

import { Component } from "@angular/core";
import { Repository } from "../../repository.model";
import { ProductFormGroup } from "./form.model";

@Component({
  selector: "reactive-forms",
  templateUrl: "reactive-forms.component.html"
})
export class ReactiveFormsComponent {
  repository: Repository = new Repository();
  form: ProductFormGroup = new ProductFormGroup();
  submitted: boolean = false;

  submitForm() {
    this.submitted = true;
    if (this.form.valid) {
      this.repository.saveProduct(this.form.value);
      this.form.reset();
      this.submitted = false;
    }
  }
}
