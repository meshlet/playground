import {Component, Inject} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ProductModel} from "../model/product.model";
import {RepositoryModel} from "../model/repository.model";
import {ActivatedRoute} from "@angular/router";

/**
 * This components lets user create a new product or edit an existing one.
 */
@Component({
  selector: "product-form",
  templateUrl: "product-form.component.html"
})
export class ProductFormComponent {
  public newProduct = new ProductModel();
  public isEditing = false;

  /**
   * ActivatedRoute is a service that, among other things, keeps track of the currently
   * activated route. The ActivatedRouter.snapshot property points to an instance of the
   * ActivatedRouterSnapshot class which represents the router that is currently active.
   * ActivatedRouterSnapshot.url is an array of URL segments, so if the currently active
   * router is "form/edit" this property would be set to ["form", "edit"].
   *
   * Furthermore, ActivatedRouterSnapshot.params is an object whose properties correspond
   * to the currently active router parameters. If the currently active router is
   * "form/:mode/:id", then the ActivatedRouterSnapshot.params objects would be
   * { mode: "...", id: ... }.
   */
  constructor(private repository: RepositoryModel, private activatedRoute: ActivatedRoute) {
    this.isEditing = activatedRoute.snapshot.params["mode"] === "edit";
    const idStr: string | undefined = activatedRoute.snapshot.params["id"];
    if (idStr !== undefined) {
      // Find the product with the given ID and assign it to the product instance used
      // in the data binding expressions in this component's view. This will populate
      // the form fields with the selected product data.
      //
      // @note In case where data is loaded asynchronously from the server, it might
      // happen that this router gets activated before the products have been read from
      // the server. In this case the getProduct below would return undefined causing
      // Object.assign to throw an error.
      Object.assign(this.newProduct, repository.getProduct(Number.parseInt(idStr)));
    }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);
    }
  }

  resetForm(form: NgForm) {
    this.newProduct = new ProductModel();
    form.resetForm();
  }
}
