import {Component, Inject} from "@angular/core";
import {RepositoryModel} from "../model/repository.model";
import {ProductModel} from "../model/product.model";

/**
 * This component displays a table of all the products, allowing the user
 * to delete products as well as initiate product update or creation of a
 * new product.
 */
@Component({
  selector: "product-table",
  templateUrl: "product-table.component.html",
})
export class ProductTableComponent {
  constructor(private repository: RepositoryModel) {
  }

  getProduct(key: number): ProductModel | undefined {
    return this.repository.getProduct(key) || undefined;
  }

  getProducts(): ProductModel[] {
    return this.repository.getProducts() || [];
  }

  deleteProduct(id: number) {
    this.repository.deleteProduct(id);
  }

  editProduct(product: ProductModel) {
    // Signal that user wishes to edit the given Product
    //this.modeObserver.next(new ModeTrackerModel(MODE.EDIT, product.id));
  }

  createProduct() {
    // Signal that user wishes to create a new product
    //this.modeObserver.next(new ModeTrackerModel(MODE.CREATE));
  }
}

