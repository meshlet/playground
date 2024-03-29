import { Component } from "@angular/core";
import { Repository } from "../repository.model";
import { Product } from "../product.model";

@Component({
  selector: "builtin-directives",
  templateUrl: "builtin-directives.component.html"
})
export class BuiltinDirectivesComponent {
  repository: Repository = new Repository();
  targetName: string = "Kayak";

  getProduct(key: number): Product | undefined {
    return this.repository.getProduct(key);
  }

  getProducts(): Product[] {
    return this.repository.getProducts();
  }

  getProductCount(): number {
    return this.getProducts().length;
  }

  getKey(index: number, product: Product): number | undefined {
    return product.id;
  }
}
