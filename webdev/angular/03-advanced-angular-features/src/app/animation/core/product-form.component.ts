import {Component, Inject} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ProductModel} from "../model/product.model";
import {RepositoryModel} from "../model/repository.model";
import {ActivatedRoute, Params, Router} from "@angular/router";

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

  constructor(public repository: RepositoryModel,
              private router: Router,
              activatedRoute: ActivatedRoute) {

    activatedRoute.params.subscribe((params: Params) => {
      this.isEditing = params["mode"] === "edit";
      const idStr: string | undefined = params["id"];

      if (this.isEditing && idStr) {
        let id = Number.parseInt(idStr);

        if (this.repository.getProducts().findIndex((p: ProductModel) => p.id === id) === -1) {
          // The provided product ID doesn't exist (can only happen if user manually
          // enters an URL with unknown ID). Navigate to the base URL
          this.router.navigateByUrl("/animation-samples");
          return;
        }

        Object.assign(this.newProduct, this.repository.getProduct(id));
      }
      else if (this.isEditing) {
        // If editing mode is enabled but product ID is not provided (can only happen
        // if user manually navigates to /form/edit URL), navigate back to the initial
        // URL
        this.router.navigateByUrl("/animation-samples");
      }
    })
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.repository.saveProduct(this.newProduct);

      // The Router service provides navigateByUrl and navigate methods both of
      // which are used to change the active router. They return a Promise object
      // which can be used to execute async code for success or failure (such
      // as reporting an error if router change has failed for example).
      this.router.navigateByUrl("/animation-samples");
    }
  }
}
