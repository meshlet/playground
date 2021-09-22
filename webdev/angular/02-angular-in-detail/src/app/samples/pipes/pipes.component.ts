import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Repository } from "../../repository.model";
import { Product } from "../../product.model";

@Component({
  selector: "pipes",
  templateUrl: "pipes.component.html"
})
export class PipesComponent {
  price: number = 0;
  taxRate: number = 0;
  repository = new Repository();
  newProduct = new Product();
  selectedCategory = "";
  selectedLocaleId = "en-US";
  selectedPercentage = "0.0";
  dateObject = new Date(2020, 1, 20);
  dateString = "2020-02-20T00:00:00.000Z";
  dateNumber = 1582156800000;
  aString = "";
  itemCount = this.repository.getProducts().length;

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);
      this.newProduct = new Product();
      form.resetForm();
    }
  }
}
