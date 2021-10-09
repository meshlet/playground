import {Component, Inject} from "@angular/core";
import {RepositoryModel} from "../model/repository.model";
import {ProductModel} from "../model/product.model";
import { MODE, ModeTrackerModel, MODE_TRACKER_TOKEN } from "./mode-tracker.model";
import {Observer} from "rxjs";

/**
 * This component displays a table of all the products, allowing the user
 * to delete products as well as initiate product update or creation of a
 * new product.
 *
 * @note The component defines an Observer<ModeTrackerModel> dependency, that is
 * used to signal whether the user wishes to create a new product or edit an
 * existing one. When user clicks the `Create New Product` button, the component
 * signals an event informing all listeners that user wishes to create a new
 * product. Similarly, when user clicks the `Edit` button, the component signals
 * an event informing the listeners that user wishes to edit an existing product.
 */
@Component({
  selector: "product-table",
  templateUrl: "product-table.component.html",
})
export class ProductTableComponent {
  constructor(private repository: RepositoryModel,
              @Inject(MODE_TRACKER_TOKEN) private modeObserver: Observer<ModeTrackerModel>) {
  }

  getProduct(key: number): ProductModel | undefined {
    return this.repository.getProduct(key) || undefined;
  }

  getProducts(): ProductModel[] {
    return this.repository.getProducts() || [];
  }

  deleteProduct(key: number) {
    this.repository.deleteProduct(key);
  }

  editProduct(product: ProductModel) {
    // Signal that user wishes to edit the given Product
    this.modeObserver.next(new ModeTrackerModel(MODE.EDIT, product.id));
  }

  createProduct() {
    // Signal that user wishes to create a new product
    this.modeObserver.next(new ModeTrackerModel(MODE.CREATE));
  }
}

