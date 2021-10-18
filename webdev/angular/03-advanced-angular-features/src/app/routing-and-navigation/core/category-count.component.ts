import {Component, DoCheck} from "@angular/core";
import { IterableDiffers, IterableDiffer } from "@angular/core";
import { RepositoryModel } from "../model/repository.model";
import {ProductModel} from "../model/product.model";

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
  <div class="bg-secondary text-white p-2">
      There are {{ categoryCount }} categories.
  </div>`
})
export class CategoryCountComponent implements DoCheck {
  private differ: IterableDiffer<any>;
  public categoryCount = 0;

  constructor(private repository: RepositoryModel, differs: IterableDiffers) {
    this.differ = differs.find(repository.getProducts()).create((index: number, product: ProductModel) => {
      return product.id as number;
    });
  }

  ngDoCheck(): void {
    if (this.differ.diff(this.repository.getProducts())) {
      const uniqueCategories = new Array<string>();
      for (let p of this.repository.getProducts()) {
        if (uniqueCategories.findIndex((value: string) => value === p.category) === -1) {
          uniqueCategories.push(p.category);
        }
      }
      this.categoryCount = uniqueCategories.length;
    }
  }
}
