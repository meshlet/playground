import {Component, Inject} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ProductModel} from "../model/product.model";
import {RepositoryModel} from "../model/repository.model";
import {ActivatedRoute, Router} from "@angular/router";

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
  constructor(private repository: RepositoryModel,
              private router: Router,
              activatedRoute: ActivatedRoute) {
    this.isEditing = activatedRoute.snapshot.params["mode"] === "edit";

    const idStr: string | undefined = activatedRoute.snapshot.params["id"];
    if (idStr) {
      let id = Number.parseInt(idStr);

      // First try and see if name, category and price were passed as optional route
      // parameters. If this is the case use them to pre-fill the product form.
      const name: string | undefined = activatedRoute.snapshot.params["name"];
      const category: string | undefined = activatedRoute.snapshot.params["category"];
      const priceStr: string | undefined = activatedRoute.snapshot.params["price"];

      if (name && category && priceStr) {
        // Initialize the product form fields (bound to the this.newProduct) with values
        // passed via optional parameters
        this.newProduct.id = id;
        this.newProduct.name = name;
        this.newProduct.category = category;
        this.newProduct.price = parseFloat(priceStr);
      }
      else {
        // Find the product with the given ID and assign it to the product instance used
        // in the data binding expressions in this component's view. This will populate
        // the form fields with the selected product data.
        //
        // @note In case where data is loaded asynchronously from the server, it might
        // happen that this router gets activated before the products have been read from
        // the server. In this case the getProduct below would return undefined causing
        // Object.assign to throw an error.
        Object.assign(this.newProduct, this.repository.getProduct(id));
      }
    }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);

      // The Router service provides navigateByUrl and navigate methods both of
      // which are used to change the active router. They return a Promise object
      // which can be used to execute async code for success or failure (such
      // as reporting an error if router change has failed for example).
      this.router.navigateByUrl("/");
    }
  }

  resetForm(form: NgForm) {
    this.newProduct = new ProductModel();
    form.resetForm();
  }
}
