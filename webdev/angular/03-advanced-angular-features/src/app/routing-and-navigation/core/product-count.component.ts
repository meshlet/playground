import {Component, DoCheck} from "@angular/core";
import { IterableDiffers, IterableDiffer } from "@angular/core";
import { RepositoryModel } from "../model/repository.model";
import {ProductModel} from "../model/product.model";
import {ActivatedRoute, Params} from "@angular/router";
import {ProductTableComponent} from "./product-table.component";
import {CategoryCountComponent} from "./category-count.component";

/**
 * The following component keeps track and displays the number of products
 * currently present in the repository.
 *
 * @note Used to illustrate using child routes. See product-table.component.ts for more
 * details.
 */
@Component({
  selector: "product-count",
  template: `
  <div class="bg-info text-white p-2">
      There are {{ productCount }} products.
  </div>`
})
export class ProductCountComponent implements DoCheck {
  private differ: IterableDiffer<any>;
  public productCount = 0;
  private selectedCategory: string | undefined;

  constructor(private repository: RepositoryModel, differs: IterableDiffers, activatedRoute: ActivatedRoute) {
    // Find and create a diffing strategy with a custom TrackByFunction
    this.differ = differs.find(repository.getProducts()).create((index: number, product: ProductModel) => {
      return product.id as number;
    });

    // This component can be activated via a child route defined in routing-and-navigation.routing.ts:
    //
    // {
    //     path: "table/:category",
    //     component: ProductTableComponent,
    //     children: [
    //       { path: "products", component: ProductCountComponent },
    //       { path: "categories", component: CategoryCountComponent },
    //       { path: "", component: ProductCountComponent }
    //     ]
    // }
    //
    // As explained in that source file, the ActivatedRoute service passed to this
    // class only has access to the route segment that activated the component which
    // is the "products" segment. However, this component also want to access the
    // ":category" route parameter from the parent route. This can be done using
    // the ActivatedRoute.pathFromRoot property, which is an array of ActivatedRoute
    // instances, for every route segment starting from the route. In order to get
    // notified about the change in the parameter defined in the route outside of
    // its own, this component subscribes to ActivatedRoute.params observers
    // for all route segments which guarantees that it will catch any changes in
    // parameters in any route starting from the top-level one (the root).
    activatedRoute.pathFromRoot.forEach((route: ActivatedRoute) => {
      route.params.subscribe((params: Params) => {
        if (typeof params["category"] === "string") {
          this.selectedCategory = params["category"];
          this.countProducts();
        }
      })
    })
  }

  ngDoCheck(): void {
    if (this.differ.diff(this.repository.getProducts())) {
      this.countProducts();
    }
  }

  countProducts() {
    if (this.selectedCategory !== undefined) {
      // If a category has been selected, count the products in that category
      this.productCount = this.repository.getProducts()
        .filter((product: ProductModel) => this.selectedCategory === product.category)
        .length;
    }
    else {
      // Otherwise, count all products
      this.productCount = this.repository.getProducts().length;
    }
  }
}
