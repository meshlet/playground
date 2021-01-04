/**
 * Component for the template that lists the products with buttons that
 * allow an admin to initiate the process of creating a new product
 * or editing/deleting an existing product.
 */
import { Component } from '@angular/core';
import {ProductRepository} from '../model/product.repository';
import {Router} from '@angular/router';
import {Product} from '../model/product.model';

@Component({
  templateUrl: 'product-table.component.html'
})
export class ProductTableComponent {
  constructor(public repository: ProductRepository,
              private router: Router) {
  }

  public editProduct(product: Product): void {
    this.router.navigateByUrl(`/admin/main/products/edit/${product.Id}`);
  }

  public createProduct(): void {
    this.router.navigateByUrl(`/admin/main/products/create`);
  }

  public deleteProduct(product: Product): void {
    this.repository.deleteProduct(product);
  }
}
