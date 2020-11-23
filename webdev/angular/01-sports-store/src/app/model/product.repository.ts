/**
 * Repository that controls access to product data.
 */
import { Injectable } from '@angular/core';
import { Product } from './product.model';
// import { StaticDatasource } from './static.datasource';
import { RestDatasource } from './rest.datasource';

@Injectable()
export class ProductRepository {
  private products: Product[] = [];
  private categories: string[] = [];

  constructor(private dataSource: RestDatasource) {
    this.dataSource.getProducts().subscribe(data => {
      this.products = data;

      // Generate a list of categories (filter out the duplicates)
      this.categories =
        this.products.map(p => p.Category)
          .filter((elem, index, array) => array.indexOf(elem) === index)
          .sort();
    });
  }

  getProducts(category?: string): Product[] {
    if (category == null) {
      return this.products;
    }

    return this.products.filter(p => p.Category === category);
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(p => p.Id === id);
  }

  saveProduct(product: Product): void {
    if (product.Id === undefined) {
      // This is a new product that needs to be created at server side
      this.dataSource.saveProduct(product)
        .subscribe(p => this.products.push(p));
    }
    else {
      // Update an existing product
      // TODO: the splicing of the product into this.products array should not
      //       be necessary if `product` points to one of the objects within
      //       the this.products array
      this.dataSource.updateProduct(product)
        .subscribe(p1 => {
          this.products.splice(this.products.findIndex(p2 => p2.Id === product.Id),
            1, product);
        });
    }
  }

  deleteProduct(product: Product): void {
    this.dataSource.deleteProduct(product)
      .subscribe(p1 => {
        // Delete the product from the list of products
        this.products.splice(this.products.findIndex(p2 => p2.Id === product.Id), 1);
      });
  }

  getCategories(): string[] {
    return this.categories;
  }
}
