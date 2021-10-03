/**
 * Illustrates creating and using custom attribute directives.
 */

import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Repository } from "../../repository.model";
import { Product } from "../../product.model";

@Component({
  selector: "attribute-directives",
  templateUrl: "attribute-directives.component.html"
})
export class AttributeDirectivesComponent {
  repository: Repository = new Repository();
  newProduct: Product = new Product();
  checkbox1Checked = true;
  checkbox2Checked = true;
  checkbox3Checked = true;
  checkbox4Checked = true;
  checkbox5Checked = true;

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);
      this.newProduct = new Product();
      form.resetForm();
    }
  }
}

