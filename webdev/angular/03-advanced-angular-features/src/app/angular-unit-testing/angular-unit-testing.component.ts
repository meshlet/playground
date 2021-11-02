import {Component, EventEmitter, HostListener, Input, Output} from "@angular/core";
import { RepositoryModel } from "./repository.model";
import { ProductModel } from "./product.model";

@Component({
  selector: "angular-unit-testing",
  template: `
    <h2> Angular Unit Testing </h2>
    <p>
        The unit tests in src/app/angular-unit-testing illustrate how to test
        Angular apps (and specifically components and directives) using the
        Jasmine unit testing framework.
    </p>
  `
})
export class AngularUnitTestingComponent {
}

/**
 * The following is a simple component used to illustrated basic unit-testing
 * features in angular-unit-testing.component.spec.ts.
 */
@Component({
  selector: "in-place-template-component",
  template: `
    <h2>A component with in-place template</h2>
  `
})
export class InPlaceTemplateComponent {
}

/**
 * The following component defines a dependency to a service and uses a data-binding
 * in its template.
 */
@Component({
  selector: "service-dep-and-data-binding-component",
  template: `
    <div>
        There are <span class="font-weight-bold">{{ getProducts().length }}</span> products.
    </div>
  `
})
export class ServiceDepAndDataBindingComponent {
  public selectedCategory = "Soccer";

  constructor(private repository: RepositoryModel) {
  }

  getProducts(): ProductModel[] {
    return this.repository.getProducts()
      .filter(p => p.category == this.selectedCategory);
  }
}

/**
 * The following a component with an external template that also uses
 * the @HostListener decorator to bind two events to a method and an
 * EventEmitter output property used emit events from the component.
 */
@Component({
  selector: "ext-tmpl-host-listener-and-output-prop-component",
  templateUrl: "ext-tmpl-host-listener-and-output-prop.component.html"
})
export class ExtTmplHostListenerAndOutputPropComponent {
  public mouseEnterOrLeave = "";

  @Output("mouse-event-change")
  mouseEventChange = new EventEmitter<string>();

  @HostListener("mouseenter", ["$event.type"])
  @HostListener("mouseleave", ["$event.type"])
  handleEvent(type: string) {
    this.mouseEnterOrLeave = type;
    this.mouseEventChange.emit(type);
  }
}

/**
 * The following component receives RepositoryModel via an input property.
 */
@Component({
  selector: "input-prop-component",
  template: `
    <div>
        There are <span class="font-weight-bold">{{ getProducts().length }}</span> products.
    </div>
  `
})
export class InputPropComponent {
  public selectedCategory = "";

  @Input("repository")
  repository?: RepositoryModel;

  getProducts(): ProductModel[] {
    return this.repository ?
      this.repository.getProducts().filter(p => p.category == this.selectedCategory) :
      [];
  }
}
