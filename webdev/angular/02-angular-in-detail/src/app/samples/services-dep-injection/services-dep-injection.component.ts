import { Component } from "@angular/core";
import { DiscountService } from "./discount.service";

@Component({
  selector: "services-dep-injection",
  templateUrl: "services-dep-injection.component.html"
})
export class ServicesDepInjectionComponent {
  /**
   * This is a shared object used by DiscountDisplaySharingObjectsViaInputPropsComponent
   * (defined in discount-display.component.ts) and DiscountEditorSharingObjectsViaInputPropsComponent
   * (defined in discount-editor.component.ts) components both of which are children of the
   * ServicesDepInjectionComponent component. Parent shares the object with the children using
   * their input properties. To understand why this isn't the best way to implement object
   * sharing see discount-display.component.ts and discount-editor.component.ts.
   */
  discounter = new DiscountService();

  price: number = 0;
}
