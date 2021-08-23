/**
 * Illustrates using event bindings as well as two-way data bindings.
 */

import { Component } from "@angular/core";
import { Repository } from "../repository.model";
import { Product } from "../product.model";

@Component({
  selector: "events-2way-data-bindings",
  templateUrl: "events-2way-data-bindings.component.html"
})
export class Events2wayDataBindingsComponent {
  repository: Repository = new Repository();
  selectedProductName: string | undefined = undefined;

  getProduct(key: number): Product | undefined {
    return this.repository.getProduct(key);
  }

  getProducts(): Product[] {
    return this.repository.getProducts();
  }

  isSelected(product: Product): boolean {
    return this.selectedProductName === product.name;
  }
}
