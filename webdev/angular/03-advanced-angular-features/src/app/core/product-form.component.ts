import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ProductModel} from "../model/product.model";
import {RepositoryModel} from "../model/repository.model";
import {MODE, TrackModeService} from "./track-mode.service";

@Component({
  selector: "product-form",
  templateUrl: "product-form.component.html"
})
export class ProductFormComponent {
  newProduct = new ProductModel();

  constructor(private repository: RepositoryModel, private modeService: TrackModeService) {
  }

  isEditing(): boolean {
    return this.modeService.mode == MODE.EDIT;
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);
      this.newProduct = new ProductModel();
      form.resetForm();
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.newProduct = new ProductModel();
  }
}
