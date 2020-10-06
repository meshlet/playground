/**
 * The Store component.
 */
import { Component } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductRepository } from '../model/product.repository';

@Component({
  selector: 'app-store',
  templateUrl: 'store.component.html'
})
export class StoreComponent {
  private selectedCategory: string = null;

  constructor(private repository: ProductRepository) { }

  get Products(): Product[] {
    return this.repository.getProducts(this.selectedCategory);
  }

  get Categories(): string[] {
    return this.repository.getCategories();
  }

  get SelectedCategory(): string {
    return this.selectedCategory;
  }

  set SelectedCategory(category: string) {
    this.selectedCategory = category;
  }
}
