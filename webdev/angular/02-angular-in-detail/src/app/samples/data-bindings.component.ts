import { Component } from "@angular/core";
import { Repository } from "../repository.model";
import { Product } from "../product.model";

@Component({
  selector: "data-bindings",
  templateUrl: "data-bindings.component.html"
})
export class DataBindingsComponent {
  repository: Repository = new Repository();
  fontSizeWithUnits: string = "30px";
  fontSizeWithoutUnits: string= "30";

  getClassesAsString(key: number): string {
    let product = this.repository.getProduct(key);
    return product ? "p-2 " + (product.price < 50 ? "bg-info" : "bg-warning") : "";
  }

  getClassesAsArray(key: number): Array<string> {
    let product = this.repository.getProduct(key);
    return product ? ["p-2", (product.price < 50 ? "bg-info" : "bg-warning")] : [];
  }

  getClassMap(key: number): Object {
    let product = this.repository.getProduct(key);
    return {
      "text-center bg-danger": product ? product.name == "Kayak" : false,
      "bg-info": product ? product.price < 50 : false
    };
  }

  getStyles(key: number) {
    let product = this.repository.getProduct(key);
    return product ? {
      fontSize: "30px",
      "margin.px": 100,
      color: product.price > 50 ? "red" : "green"
    } : {};
  }
}
