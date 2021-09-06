/**
 * Illustrates creating and using custom structural directives.
 */

import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Repository } from "../../repository.model";
import { Product } from "../../product.model";

@Component({
  selector: "structural-directives",
  templateUrl: "structural-directives.component.html"
})
export class StructuralDirectivesComponent {
  repositories: Repository[] = [
    new Repository(), new Repository(), new Repository()
  ];
  public activeRepository = 0;
  newProduct: Product = new Product();
  checkboxChecked = false;
  priceUpdateEnabled = false;

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repositories[this.activeRepository].saveProduct(this.newProduct);
      this.newProduct = new Product();
      form.resetForm();
    }
  }

  startOrStopPriceUpdate() {
    this.priceUpdateEnabled = !this.priceUpdateEnabled;
    const thisArg: StructuralDirectivesComponent = this;
    if (this.priceUpdateEnabled) {
      (function startTimer() {
        setTimeout(() => {
          for (let product of thisArg.repositories[thisArg.activeRepository].getProducts()) {
            product.price += 2.3;
          }

          if (thisArg.priceUpdateEnabled) {
            startTimer();
          }
        }, 1500);
      })();
    }
  }

  removeProduct(index: string) {
    this.repositories[this.activeRepository].deleteProductAt(Number.parseInt(index));
  }

  shiftProductsToRight(shiftCountStr: string) {
    if (this.repositories[this.activeRepository].getProducts().length == 0) {
      return;
    }

    let shiftCount = Number.parseInt(shiftCountStr);
    if (!Number.isNaN(shiftCount)) {
      while (shiftCount-- > 0) {
        this.repositories[this.activeRepository].getProducts().unshift(
          this.repositories[this.activeRepository].getProducts().pop() as Product);
      }
    }
  }

  shiftProductsToLeft(shiftCountStr: string) {
    if (this.repositories[this.activeRepository].getProducts().length == 0) {
      return;
    }

    let shiftCount = Number.parseInt(shiftCountStr);
    if (!Number.isNaN(shiftCount)) {
      while (shiftCount-- > 0) {
        this.repositories[this.activeRepository].getProducts().push(
          this.repositories[this.activeRepository].getProducts().shift() as Product);
      }
    }
  }

  /**
   * This method recreates the products between specified start and end indices (inclusive).
   * The goal is to change each object's identity, so that Object.is() method will return
   * false when Products before the update are compared with Products at same indices after
   * the change. Note that underlying Product data has not changed, it's only the object
   * identity that has changed (i.e. different objects in memory).
   */
  recreateProducts(startStr: string, endStr:string) {
    const start = Number.parseInt(startStr);
    const end = Number.parseInt(endStr);
    if (Number.isNaN(start) || Number.isNaN(end)) {
      return;
    }

    const products = this.repositories[this.activeRepository].getProducts();
    for (let i = start >= 0 ? start : 0; i < Math.min(end + 1, products.length); ++i) {
      const product = new Product(
        products[i].id,
        products[i].name,
        products[i].category,
        products[i].price
      );
      products.splice(i, 1, product);
    }
  }

  /**
   * Used with appForDirOf directive to give means of uniquely identifying the
   * Product objects (instead of the default Object.is comparison).
   */
  getKey(index: number, product: Product): number {
    return product.id as number;
  }
}
