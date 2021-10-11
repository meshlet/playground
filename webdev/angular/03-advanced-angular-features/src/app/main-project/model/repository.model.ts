import { Injectable, Inject } from "@angular/core";
import { ProductModel } from "./product.model";
import { DataSourceInterfaceModel, DATA_SOURCE } from "./data-source-interface.model";

@Injectable()
export class RepositoryModel {
  // The member is assigned once the Observable returned by data source's
  // getData() is resolved.
  // @ts-ignore
  private products: ProductModel[];
  private locator = (p: ProductModel, id: number | undefined) => p.id === id;

  constructor(@Inject(DATA_SOURCE) private dataSource: DataSourceInterfaceModel) {
    this.dataSource.getData().subscribe((obtainedProducts: ProductModel[]) => {
      this.products = obtainedProducts;
    });
  }

  getProducts(): ProductModel[] {
    return this.products;
  }

  getProduct(id: number): ProductModel | undefined {
    return this.products.find(p => this.locator(p, id));
  }

  saveProduct(product: ProductModel) {
    if (product.id === undefined) {
      // Send the new product to the server and amend the local product
      // collection once the server responds
      this.dataSource.saveProduct(product)
        .subscribe((p: ProductModel) => {
          this.products.push(p);
        });
    } else {
      // Update the product at the server and amend the local product
      // collection
      this.dataSource.updateProduct(product)
        .subscribe((p: ProductModel) => {
          let index = this.products
            .findIndex(p => this.locator(p, product.id));

          this.products.splice(index, 1, p);
        });
    }
  }

  deleteProduct(product: ProductModel) {
    // Delete the product with the given ID at the server and
    // try to amend the local product collection
    this.dataSource.deleteProduct(product)
      .subscribe((p: ProductModel) => {
        let index = this.products.findIndex(p => this.locator(p, product.id));
        if (index > -1) {
          this.products.splice(index, 1);
        }
      });
  }
}
