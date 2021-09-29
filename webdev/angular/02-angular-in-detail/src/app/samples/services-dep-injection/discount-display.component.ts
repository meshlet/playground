import { Component, Input } from "@angular/core";
import { DiscountService } from "./discount.service";

/**
 * The following component uses an input property to obtain a shared DiscountService
 * instance. The issue with this approach is that parent component (in this case
 * ServicesDepInjectionComponent) must allocate the shared object and pass it to all
 * the children that require it, even though the parent component might not use the
 * shared object at all.
 *
 * The issue gets worse if the components using the shared object don't have a common
 * ancestor component. Consider the following component hierarchy:
 *
 *                                         cA <----- shared object must be allocated here
 *                                        /  \       and passed to cB and cC children
 *                                       /    \
 * accepts the shared object and ----> cB     cC <----- accepts and uses the shared object
 * passes it to its cD child           /
 *                                    /
 * accepts and uses the shared ---> cD
 * object
 *
 * In this example, only the cC and cD components make use of the shared object, but due
 * to the way it is distributed all the components need to be aware of it and maintain code
 * for handling the shared object. Similar situation happens in case where directives/pipes expect
 * to receive the shared object. The component whose template uses such a directive/pipe must
 * provide the shared objec to it, even though the component itself might not otherwise use
 * the shared object. This unnecessarily complicates the components and makes unit testing
 * more difficult. Object distribution is better done using Angular's dependency injection
 * as illustrated by the DiscountDisplaySharingObjectsViaDepInjectionComponent component.
 */
@Component({
  selector: "discount-display-sharing-objects-via-input-props",
  template: `
    <div class="p-2 border border-primary">
        Discount is: {{ discountService?.discount || "" }}
    </div>`
})
export class DiscountDisplaySharingObjectsViaInputPropsComponent {
  @Input("discounter")
  discountService?: DiscountService;
}

/**
 * The following component uses dependency injection to receive a shared object.
 * To make this work, component defines a constructor accepts a shared object
 * as an argument. When Angular encounters such a component, it searches the
 * NgModule's providers array to find the given shared object's class. If search
 * is successful, Angular allocated the shared object if it hasn't been allocated
 * before and passes it to the component's constructor.
 *
 * Hence, entire NgModule will have a single instance of the shared object allocated
 * and managed by Angular. In Angular terminology, shared objects are called services.
 *
 * @note Angular application can have multiple NgModules. If a service is registered
 * in the providers array of the root NgModule, entire application (including all child
 * NgModules) will have a single instance of the given service. However, if a service is
 * registered in multiple child modules, each module will have its own instance of the
 * service. In other words, allocation scope for services is the NgModule where service
 * is registered and all its child modules.
 */
@Component({
  selector: "discount-display-sharing-objects-via-dep-injection",
  template: `
    <div class="p-2 border border-primary">
        Discount is: {{ discountService.discount }}
    </div>`
})
export class DiscountDisplaySharingObjectsViaDepInjectionComponent {
  constructor(public discountService: DiscountService) {}
}
