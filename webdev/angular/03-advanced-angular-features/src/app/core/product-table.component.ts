import {Component} from "@angular/core";
import {RepositoryModel} from "../model/repository.model";
import {ProductModel} from "../model/product.model";
import {MODE, TrackModeService} from "./track-mode.service";

@Component({
  selector: "product-table",
  templateUrl: "product-table.component.html",
})
export class ProductTableComponent {
  constructor(private repository: RepositoryModel, private modeService: TrackModeService) {
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
    this.modeService.mode = MODE.EDIT;
    this.modeService.product = product;
  }

  createProduct() {
    this.modeService.mode = MODE.CREATE;
    this.modeService.product = undefined;
  }
}

