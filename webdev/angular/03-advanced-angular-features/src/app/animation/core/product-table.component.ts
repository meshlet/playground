import {Component} from "@angular/core";
import {RepositoryModel} from "../model/repository.model";
import {ProductModel} from "../model/product.model";
import {RowHighlightTrigger} from "./table-row.animation";

/**
 * This component displays a table of all the products, allowing the user
 * to delete products as well as initiate product update or creation of a
 * new product.
 */
@Component({
  selector: "product-table",
  templateUrl: "product-table.component.html",

  /**
   * For more info on Angular's animation system check table-row.animation.ts.
   */
  animations: [ RowHighlightTrigger ]
})
export class ProductTableComponent {
  public selectedCategory = "";

  constructor(private repository: RepositoryModel) {
  }

  getProduct(key: number): ProductModel | undefined {
    return this.repository.getProduct(key) || undefined;
  }

  getProducts(): ProductModel[] {
    return this.repository.getProducts();
  }

  getCategories(): string[] {
    const categories: string[] = [];
    for (let p of this.repository.getProducts()) {
      if (categories.findIndex((c: string) => c === p.category) === -1) {
        categories.push(p.category);
      }
    }
    return categories;
  }

  deleteProduct(id: number) {
    this.repository.deleteProduct(id);
  }

  getRowAnimationState(category: string): string {
    if (this.selectedCategory === "") {
      return "initial";
    }

    return this.selectedCategory === category ? "rowSelected" : "rowNotSelected";
  }
}

