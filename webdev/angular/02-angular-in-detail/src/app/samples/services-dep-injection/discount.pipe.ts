import { Pipe, PipeTransform } from "@angular/core";
import { DiscountService } from "./discount.service";

@Pipe({
  name: "discount",
  pure: false
})
export class DiscountPipe implements PipeTransform{
  constructor(private discountService: DiscountService) {}

  transform(price: any): number {
    console.log(typeof price);
    return this.discountService.applyDiscount(Number.parseFloat(price));
  }
}
