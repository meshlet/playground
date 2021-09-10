import { Component } from "@angular/core";
import { Repository } from "../../repository.model";

@Component({
  selector: "components-in-detail",
  templateUrl: "components-in-detail.component.html",
  styles: [
    /**
     * Most of the CSS styles are not inheritable, meaning that if applied to parent
     * element those styles are not inherited by the children. Border styles are
     * one of these.
     *
     * Let's say the goal is to apply border to any DIV element which is a child
     * of this component's host element (components-in-detail). We can use ::ng-deep
     * pseudo class for this purpose. Applying the ::ng-deep pseudo class to any CSS
     * rule entirely disables the view encapsulation for that rule (for in-depth
     * description of what view encapsulation is check product-table.component.ts),
     * meaning that the CSS rule becomes global. Hence, the following CSS rule
     *
     * ::ng-deep div { border: 2px solid black; }
     *
     * would make this rule match any DIV on the page. To limit the rule scope only
     * to DIVs that are children of the host element we can use the :host selector
     * (for in-depth description of :host check product-form.component.ts), which
     * matches only the components-in-detail host element itself. If we rewrite the
     * CSS rule in the following way
     *
     * :host ::ng-deep div { border: 2px solid black; }
     *
     * it will match any DIV element which is a child (at any level) of the host
     * element, which accomplishes the initial goal.
     *
     * @note ::ng-deep (and its aliases /deep/ and >>>) are deprecated and will
     * be removed from Angular:
     * https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep
     */
    ":host ::ng-deep div { border: 2px solid black; }"
  ]
})
export class ComponentsInDetailComponent {
  public repository = new Repository();
}
