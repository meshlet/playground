import { Product } from "./product.model";
import { SimpleDataSource } from "./datasource.model";

export class Repository {
  private dataSource: SimpleDataSource;
  private readonly products: Product[];
  private locator = (p: Product, id: number | undefined) => p.id === id;

  constructor() {
    this.dataSource = new SimpleDataSource();
    this.products = this.dataSource.getData();
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(p => this.locator(p, id));
  }

  saveProduct(product: Product) {
    if (product.id === undefined) {
      product.id = this.generateID();
      this.products.push(product);
    } else {
      let index = this.products
        .findIndex(p => this.locator(p, product.id));
      this.products.splice(index, 1, product);
    }
  }

  deleteProduct(id: number): Product | null {
    let index = this.products.findIndex(p => this.locator(p, id));
    if (index > -1) {
      return this.products.splice(index, 1)[0];
    }
    return null;
  }

  deleteProductAt(index: number): Product | null {
    if (index >= 0 && index < this.products.length) {
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
