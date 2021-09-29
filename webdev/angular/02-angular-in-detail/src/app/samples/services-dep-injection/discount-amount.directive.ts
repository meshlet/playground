import {
  Directive, KeyValueDiffers, KeyValueDiffer, Input, OnChanges, DoCheck,
  SimpleChanges
} from "@angular/core";
import { DiscountService } from "./discount.service";

/**
 * The following directive calculates the discount based on the provided
 * price and the price after discount obtained from the DiscountService
 * service.
 *
 * The directive uses dependency injection to obtain an instance of the
 * DiscountService service. The important thing to note is that the
 * `ngOnChanges` life-cycle hook is not invoked by Angular in case of changes
 * in any of the services injected to the directive's constructor. This is
 * similar to array/object input properties, in a sense that Angular does not
 * automatically detected changes in such input properties neither and won't
 * invoke the `ngOnChanges` hook.
 *
 * However, the directive wants to react on service changes and thus implements
 * the `ngDoCheck` hook that is invoked on any changes anywhere in the application
 * (for more info on change detection see structural-directives/for.directive.ts).
 *
 * The directive uses `KeyValueDiffers` repository to find a suitable diffing
 * strategy for the DiscountService object. This repository contains diffing
 * strategies suitable for diffing Maps (or Objects), which means it nicely
 * fits the usage of detecting change between DiscountService instances.
 */
@Directive({
  selector: "[appDiscountAmount]",

  /**
   * Export the directive so that templates can use it to access the discountAmount
   * property.
   */
  exportAs: "discount"
})
export class DiscountAmountDirective implements OnChanges, DoCheck{
  /**
   * A diffing strategy used to compare DiscountService instances.
   */
  private differ: KeyValueDiffer<any, any>;

  /**
   * Two services are injected into the constructor, the KeyValueDiffers repository
   * and the DiscountService instances. The repository is used to find a suitable
   * diffing strategy and create its instances.
   */
  constructor(keyValueDiffers: KeyValueDiffers,
              private discountService: DiscountService){
    this.differ = keyValueDiffers.find(this.discountService).create();
  }

  /**
   * Price is passed in via this input property.
   */
  @Input("appPrice")
  originalPrice: number = 0;

  /**
   * Contains the calculated discount.
   */
  discountAmount: number = 0;

  /**
   * This hook is invoked each time the `originalPrice` property changes, at
   * which point directive must update the discount.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["originalPrice"] != null) {
      this.updateDiscount();
    }
  }

  /**
   * As changes in injected services are not automatically detected, this hook
   * manually diffs the previous and current state of the DiscountService and
   * in case of differences re-calculates the discount.
   */
  ngDoCheck(): void {
    if (this.differ.diff(this.discountService) != null) {
      this.updateDiscount();
    }
  }

  private updateDiscount() {
    this.discountAmount = this.originalPrice - this.discountService.applyDiscount(this.originalPrice);
  }
}
