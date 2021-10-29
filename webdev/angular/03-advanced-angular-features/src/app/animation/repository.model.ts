import { ProductModel } from "./product.model";
import { StaticDataSourceModel } from "./static-data-source.model";

export class RepositoryModel {
  // The member is assigned once the Observable returned by data source's
  // getData() is resolved.
  // @ts-ignore
  private products: ProductModel[];
  private locator = (p: ProductModel, id: number | undefined) => p.id === id;
  private dataSource = new StaticDataSourceModel();

  constructor() {
    this.dataSource.getData().subscribe((obtainedProducts: ProductModel[] | null) => {
      this.products = obtainedProducts || [];
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

  deleteProduct(id: number) {
    // Delete the product with the given ID at the server and
    // try to amend the local product collection
    this.dataSource.deleteProduct(id)
      .subscribe((p: ProductModel) => {
        let index = this.products.findIndex(p => this.locator(p, id));
        if (index > -1) {
          this.products.splice(index, 1);
        }
      });
  }

  getNextProductId(id: number): number {
    let index = this.products.findIndex(p => this.locator(p, id));
    if (index > -1) {
      // Created products are certain to have defined IDs so it is safe to assume that
      // all of the IDs are numbers
      return this.products[this.products.length > index + 1 ? index + 1 : 0].id as number;
    }
    return -1;
  }

  getPreviousProductId(id: number): number {
    let index = this.products.findIndex(p => this.locator(p, id));
    if (index > -1) {
      // Created products are certain to have defined IDs so it is safe to assume that
      // all of the IDs are numbers
      return this.products[index > 0 ? index - 1 : this.products.length - 1].id as number;
    }
    return -1;
  }
}
