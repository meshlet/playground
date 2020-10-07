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
  private selectedPage = 0;
  private productsPerPage = 4;

  constructor(private repository: ProductRepository) { }

  private getNumPages(): number {
    return Math.ceil(
      this.repository.getProducts(this.selectedCategory).length / this.productsPerPage);
  }
  getProducts(): Product[] {
    const index = this.selectedPage * this.productsPerPage;
    return this.repository.getProducts(this.selectedCategory)
      .slice(index, index + this.productsPerPage);
  }

  getCategories(): string[] {
    return this.repository.getCategories();
  }

  get SelectedCategory(): string {
    return this.selectedCategory;
  }

  set SelectedCategory(category: string) {
    this.selectedCategory = category;
    this.selectedPage = 0;
  }

  get SelectedPage(): number {
    return this.selectedPage;
  }

  set SelectedPage(page: number) {
    this.selectedPage = page;
  }

  get ProductsPerPage(): string {
    return this.productsPerPage.toString();
  }

  set ProductsPerPage(productsPerPage: string) {
    this.productsPerPage = Number(productsPerPage);
    this.selectedPage = 0;
  }

  previousPage(): void {
    // Make sure the selectedPage index doesn't get out of range
    // which might happen if user uses previous first page has been
    // reached
    if (this.selectedPage > 0) {
      --this.selectedPage;
    }
  }

  nextPage(): void {
    // Make sure the selectedPage index doesn't get out of range
    // which might happen if user uses next button last page has been
    // reached
    if (this.selectedPage < this.getNumPages() - 1) {
      ++this.selectedPage;
    }
  }

  /**
   * It returns an array of page numbers that are currently in
   * range.
   *
   * TODO: This method is needed because *ngFor directive can only
   *       loop over individual items of the collection and cannot
   *       behave as a regular for loop. This can be worked around
   *       by using a custom structural directive.
   */
  getPageNumbers(): number[] {
    const numPages = this.getNumPages();

    // The method assumes that pagination shows 5 page numbers
    // in total, the currently selected page and additional 4
    // pages
    // TODO: make the number of pages shown in pagination menu
    //       configurable
    const pageNumbers: number[] = [];
    for (let i = this.selectedPage - 2; pageNumbers.length < Math.min(5, numPages); ++i) {
      if (i < 0) {
        // This is not a page index
        continue;
      }

      pageNumbers.push(i);
    }
    return pageNumbers;
  }
}
