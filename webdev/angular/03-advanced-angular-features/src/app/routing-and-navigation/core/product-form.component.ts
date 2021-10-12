import {Component, Inject} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ProductModel} from "../model/product.model";
import {RepositoryModel} from "../model/repository.model";

/**
 * This components lets user create a new product or edit an existing one.
 */
@Component({
  selector: "product-form",
  templateUrl: "product-form.component.html"
})
export class ProductFormComponent {
  public newProduct = new ProductModel();
  public isEditing = false;

  constructor(private repository: RepositoryModel) {
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);

      // Reset the form but only if current mode is not EDIT. This is to
      // keep the data of the product that was just edited in the form,
      // in case user wants to edit it again.
      if (!this.isEditing) {
        this.newProduct = new ProductModel();
        form.resetForm();
      }
    }
  }

  resetForm(form: NgForm) {
    this.newProduct = new ProductModel();
    form.resetForm();
  }
}
