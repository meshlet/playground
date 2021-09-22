import { Pipe, PipeTransform } from "@angular/core";
import { Product } from "../../product.model";

@Pipe({
  name: "categoryFilter",
  pure: false
})
export class CategoryFilterPipe implements PipeTransform {
  transform(value: Product[], category: string): any {
    return category === undefined || category === "" ?
      value :
      value.filter(product => product.category === category);
  }
}
