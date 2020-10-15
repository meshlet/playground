/**
 * Repository that controls access to product data.
 */
import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { StaticDatasource } from './static.datasource';

@Injectable()
export class ProductRepository {
  private products: Product[] = [];
  private categories: string[] = [];
  private dataSource: StaticDatasource;

  constructor(dataSource: StaticDatasource) {
    this.dataSource = dataSource;
    this.dataSource.getProducts().subscribe(data => {
      this.products = data;

      // Generate a list of categories (filter out the duplicates)
      this.categories =
        data.map(p => p.Category)
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

  getCategories(): string[] {
    return this.categories;
  }
}
