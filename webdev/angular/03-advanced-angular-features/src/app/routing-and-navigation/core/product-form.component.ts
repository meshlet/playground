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

  /**
   * ActivatedRoute is a service that, among other things, keeps track of the currently
   * activated route. The ActivatedRouter.snapshot property points to an instance of the
   * ActivatedRouterSnapshot class which represents the route that is currently active.
   * ActivatedRouterSnapshot.url is an array of URL segments, so if the currently active
   * route is "form/edit" this property would be set to ["form", "edit"].
   *
   * Furthermore, ActivatedRouterSnapshot.params is an object whose properties correspond
   * to the currently active route parameters. If the currently active route is
   * "form/:mode/:id", then the ActivatedRouterSnapshot.params objects would be
   * { mode: "...", id: ... }.
   */
  constructor(public repository: RepositoryModel,
              private router: Router,
              activatedRoute: ActivatedRoute) {
    /**
     * The following illustrates how to use use ActivatedRoute.snapshot to access
     * the route parameters and optional parameters. It is commented out because
     * the code underneath it does the same thing by registering to the
     * ActivatedRoute.params observable to receive route change notifications. See
     * comment below for details.
     */
    // this.isEditing = activatedRoute.snapshot.params["mode"] === "edit";
    // const idStr: string | undefined = activatedRoute.snapshot.params["id"];
    // if (idStr) {
    //   let id = Number.parseInt(idStr);
    //
    //   // First try and see if name, category and price were passed as optional route
    //   // parameters. If this is the case use them to pre-fill the product form.
    //   const name: string | undefined = activatedRoute.snapshot.params["name"];
    //   const category: string | undefined = activatedRoute.snapshot.params["category"];
    //   const priceStr: string | undefined = activatedRoute.snapshot.params["price"];
    //
    //   if (name && category && priceStr) {
    //     // Initialize the product form fields (bound to the this.newProduct) with values
    //     // passed via optional parameters
    //     this.newProduct.id = id;
    //     this.newProduct.name = name;
    //     this.newProduct.category = category;
    //     this.newProduct.price = parseFloat(priceStr);
    //   }
    //   else {
    //     // Find the product with the given ID and assign it to the product instance used
    //     // in the data binding expressions in this component's view. This will populate
    //     // the form fields with the selected product data.
    //     //
    //     // @note In case where data is loaded asynchronously from the server, it might
    //     // happen that this router gets activated before the products have been read from
    //     // the server. In this case the getProduct below would return undefined causing
    //     // Object.assign to throw an error.
    //     Object.assign(this.newProduct, this.repository.getProduct(id));
    //   }
    // }

    /**
     * ActivatedRoute provides the following properties, each of which is an Observable
     * that can be subscribed to in order to receive routing notifications within the
     * component (i.e. routing happens but the component displayed to the user does not
     * change):
     *
     * ActivatedRoute.url - Observable<UrlSegment[]> that provides the list of URL
     *   segments each time the route changes.
     * ActivatedRoute.params - Observable<Params> that provides route parameters (including
     *   optional params) each time the route changes.
     * ActivatedRoute.queryParams - Observable<Params> that provides URL query parameters
     *   each time the route changes.
     * ActivatedRoute.fragment - Observable<string> that provides the URL fragment each time
     *   the route changes.
     *
     * Important thing to note is that the subscriber callback will be executed only if the
     * component that registered it is currently being displayed to the user, i.e. the
     * component instance exists. Once user navigates away from the component, Angular will
     * destroy it and the subscriber will no longer execute (if it did, that would cause all
     * sort of issues). Hence, this mechanism can be used to receive only those routing
     * notifications that happen within the component. For inter-component routing changes
     * one can subscribe to Router.events as illustrated in routing-and-navigation.component.ts.
     *
     * @note The ActivatedRoute Observables are of the BehaviorObservable type, meaning that
     * they will notify the subscriber of the last event once the subscriber is registered,
     * even if that event has happened before the callback was registered. This is why this
     * constructor won't miss the initial navigation that led to it being called.
     *
     * @note It is perfectly fine to use ActivatedRoute.snapshot within the callback subscribed
     * to one of ActivatedRoute observables. For example, one can use ActivatedRoute.snapshot.url
     * to access URL segments within the callback registered to the ActivatedRoute.params observable.
     */
    activatedRoute.params.subscribe((params: Params) => {
      this.isEditing = params["mode"] === "edit";
      const idStr: string | undefined = params["id"];

      if (idStr) {
        let id = Number.parseInt(idStr);

        // First try and see if name, category and price were passed as optional route
        // parameters. If this is the case use them to pre-fill the product form.
        const name: string | undefined = params["name"];
        const category: string | undefined = params["category"];
        const priceStr: string | undefined = params["price"];

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
          // the server. In this case the getProduct below would return undefined meaning
          // that Object.assign() method will leave the destination object unmodified.
          Object.assign(this.newProduct, this.repository.getProduct(id));
        }
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
      this.router.navigateByUrl("/");
    }
  }

  resetForm(form: NgForm) {
    this.newProduct = new ProductModel();
    form.resetForm();
  }
}
