import {Component, Inject} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ProductModel} from "../model/product.model";
import {RepositoryModel} from "../model/repository.model";
import {MODE, ModeTrackerModel, MODE_TRACKER_TOKEN} from "./mode-tracker.model";
import {Observable} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

/**
 * This components lets user create a new product or edit an existing one. Component
 * defines a Observable<ModeTrackerModel> dependency, so that it can customize its
 * behavior depending on if new products is being created or existing product is
 * being edited. The component subscribes to the provided Observable, so that
 * whenever the `Create New Product` or `Edit` buttons are clicked in the
 * product-table.component.html (which results in events being signalled by the
 * ProductTableComponent) this component can react to the generated events. The
 * goal here is to pre-fill the form with existing product's data when user wishes
 * to edit the product and clear the form when user wishes to create a new product.
 *
 * @note Reactive Extensions (RxJS) is used to coordinate between the ProductTableComponent
 * (see product-table.component.ts) and ProductFormComponent. When user clicks the
 * `Create New Product` in product-table.component.ts, the ProductTableComponent triggers
 * an event on the Observer object, which in turn causes the Observable instance of the
 * ProductFormComponent to execute the registered subscriber. As explained in core.module.ts,
 * this works because the Observer instance in ProductTableComponent and Observable instance
 * in this component are actually the same service instance (an instance of RxJS's Subject
 * class which implements both Observer and Observable interfaces).
 *
 * @note The issue of sharing whether user is creating a new or editing existing product
 * between ProductTableComponent and ProductFormComponent could've been resolved by
 * making ModeTrackerModel a service, and creating a dependency on this service in both
 * of these components. The issue is that Angular does not automatically detect changes
 * in services, hence when service instance is modified in ProductTableComponent, the
 * ProductFormComponent won't in any way be notified of the changes and cannot, for example,
 * pre-fill the form data with existing product's info when user wants to edit the product.
 * This can be solved by implementing the `DoCheck` interface, so that Angular will invoke
 * the ngDoCheck method whenever there's any change in the application. However, this is
 * cumbersome and not good for performance reasons as the number of these calls gets bigger
 * and bigger as application grows (as there will be more and more unrelated events in the
 * app). Reactive Extensions solve the problem at hand in a much better way.
 */
@Component({
  selector: "product-form",
  templateUrl: "product-form.component.html"
})
export class ProductFormComponent {
  public newProduct = new ProductModel();
  public isEditing = false;

  constructor(private repository: RepositoryModel,
              @Inject(MODE_TRACKER_TOKEN) public modeObservable: Observable<ModeTrackerModel>) {
    this.modeObservable
      // Filter out repeating events using the distinctUntilChanged operator. This operator will
      // forward the event to the subscribed callback(s) only if the event object is different
      // than that of the previous event. What happens here is that if user is in the process of
      // editing a product and presses EDIT button again for the same product in the product table
      // but before saving the changes, the changes they made to the product will be lost because
      // the subscribed callback below reloads the product from the repository. Filtering out
      // repeating events solves this problem. For more details on distinctUntilChanged operator
      // see additional-samples/rxjs/rxjs.component.ts.
      .pipe(distinctUntilChanged((mode1: ModeTrackerModel, mode2: ModeTrackerModel) => {
        return mode1.id === mode2.id && mode1.mode === mode2.mode;
      }))
      // Subscribe to the mode change event. Whenever use initiates a create new or edit existing
      // product action, the ProductTableComponent (product-table.component.ts) will signal a change
      // that will be observed by the `modeObservable`.
      .subscribe(change => {
        // Create a new product instance right away, so that form fields are cleared to defaults
        // if user wishes to create a new product
        this.newProduct = new ProductModel();
        if (change.id !== undefined) {
          // This means that user wants to edit an existing product, hence copy over the product
          // data to the new product instance. This will result in the form fields being pre-filled
          // with the data of the product that is being edited.
          Object.assign(this.newProduct, repository.getProduct(change.id));
        }
        this.isEditing = change.mode == MODE.EDIT;
      });
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);

      // Reset the form but only if current mode is not EDIT. This is to
      // keep the data of the product that was just edited in the form,
      // in case user wants to edit it again.
      if (!this.isEditing) {
        this.newProduct = new ProductModel();
        form.resetForm();
      }
    }
  }

  resetForm(form: NgForm) {
    this.newProduct = new ProductModel();
    form.resetForm();
  }
}
