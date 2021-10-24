import {Component, Inject} from "@angular/core";
import {RepositoryModel} from "../model/repository.model";
import {ProductModel} from "../model/product.model";
import {ActivatedRoute, Params, Router} from "@angular/router";

/**
 * This component displays a table of all the products, allowing the user
 * to delete products as well as initiate product update or creation of a
 * new product.
 */
@Component({
  selector: "product-table",
  templateUrl: "product-table.component.html",
})
export class ProductTableComponent {
  public selectedCategory: string | undefined;

  constructor(private repository: RepositoryModel,
              activatedRoute: ActivatedRoute,
              private router: Router) {
    activatedRoute.params.subscribe((params: Params) => {
      if (typeof params["category"] === "string") {
        this.selectedCategory = params["category"];
      }
      else {
        this.selectedCategory = undefined;
      }
    });
  }

  getProduct(key: number): ProductModel | undefined {
    return this.repository.getProduct(key) || undefined;
  }

  getProducts(): ProductModel[] {
    if (this.selectedCategory === undefined) {
      // If category is not specified, return all products
      return this.repository.getProducts();
    }

    // Filter products by the currently selected category
    return this.repository.getProducts()
      .filter((product: ProductModel) => product.category === this.selectedCategory);
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

  /**
   * Determines whether the All Buttons button should be highlighted based on the
   * currently active route's path.
   */
  shouldHighlightAllProductsBtn(): boolean {
    return this.router.isActive("/animation-samples/table", {
      paths: "exact", queryParams: "exact", fragment: "ignored", matrixParams: "ignored" }) ||
      this.router.isActive("/animation-samples/table/products", {
        paths: "exact", queryParams: "exact", fragment: "ignored", matrixParams: "ignored" }) ||
      this.router.isActive("/animation-samples/table/categories", {
        paths: "exact", queryParams: "exact", fragment: "ignored", matrixParams: "ignored" });
  }
}

