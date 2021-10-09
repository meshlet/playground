import { Injectable } from "@angular/core";
import { ProductModel } from "./product.model";
import { StaticDataSourceModel } from "./static-data-source.model";

@Injectable()
export class RepositoryModel {
  private readonly products: ProductModel[];
  private locator = (p: ProductModel, id: number | undefined) => p.id === id;

  constructor(private dataSource: StaticDataSourceModel) {
    this.products = this.dataSource.getData();
  }

  getProducts(): ProductModel[] {
    return this.products;
  }

  getProduct(id: number): ProductModel | undefined {
    return this.products.find(p => this.locator(p, id));
  }

  saveProduct(product: ProductModel) {
    if (product.id === undefined) {
      product.id = this.generateID();
      this.products.push(product);
    } else {
      let index = this.products
        .findIndex(p => this.locator(p, product.id));

      this.products.splice(index, 1, product);
    }
  }

  deleteProduct(id: number): ProductModel | null {
    let index = this.products.findIndex(p => this.locator(p, id));
    if (index > -1) {
      return this.products.splice(index, 1)[0];
    }
    return null;
  }

  private generateID(): number {
    let candidate = 100;
    while (this.getProduct(candidate) != null) {
      candidate++;
    }
    return candidate;
  }
}
