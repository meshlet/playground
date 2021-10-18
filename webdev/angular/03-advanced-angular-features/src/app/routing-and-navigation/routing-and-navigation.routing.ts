import { Routes, RouterModule } from "@angular/router";
import { ProductFormComponent } from "./core/product-form.component";
import { ProductTableComponent } from "./core/product-table.component";
import {NotFoundComponent} from "./core/not-found.component";
import {ProductCountComponent} from "./core/product-count.component";
import {CategoryCountComponent} from "./core/category-count.component";

/**
 * The following describes the routes using the Routes collection.
 * Thus when Angular encounters the "form/:mode" URL, it knows to
 * load the ProductFormComponent for example. Router parameters
 * are described in more detail in product-form.component.ts.
 *
 * @note The order in which routes are defined matters. Angular
 * examines each of these in turn when matching the URL to the
 * route, hence the more specific routes should be defined first
 * followed by those that have lower specificity.
 */
const routes: Routes = [
  { path: "form/:mode/:id", component: ProductFormComponent },
  { path: "form/:mode", component: ProductFormComponent },
  { path: "table", component: ProductTableComponent },

  /**
   * The following is a route that contains child routes. For Angular to match
   * such a route, the component specified in the top-level route's `component`
   * property (ProductTableComponent here) must be the currently active component.
   * Furthermore, the URL that browser navigates to must match the concatenation
   * of the top-level route's path and one of the child route paths. In this case,
   * the "/table/products" URL matches the first child route and "/table/categories"
   * matches the second. Once child route is selected, it's component (in this case
   * ProductCountComponent or CategoryCountComponent) will be rendered within the
   * router-outlet element that is placed in the template of the parent route's
   * component (ProductTableComponent in this case).
   *
   * @note This route is placed above the { path: "table/:category", component: ProductTableComponent}
   * purposely. Considering that Angular tries to match routes in the order of
   * definition, if order of these routes was reversed, than both "/table/products"
   * and "/table/categories" URLs would match the the route with "table/:category" path
   * where "category" parameter would be set to "products" or "categories".
   */
  {
    path: "table",
    component: ProductTableComponent,
    children: [
      { path: "products", component: ProductCountComponent },
      { path: "categories", component: CategoryCountComponent }
    ]
  },

  /**
   * The following route also contains child routes, however in this case
   * the parent route's path contains router parameters. The important point
   * to remember is that each component receives only part of the root that
   * lead to its activation. For example, ProductTableComponent below receives
   * "table/:category" segment while ProductCountComponent receives "products"
   * segments. This has implications on accessing route parameters via the
   * ActivatedRoute service, as the ActivatedRoute.snapshot.params object contains
   * only parameters within the path segment that activated the given component.
   * Similarly, ActivatedRoute.params Observable will notify the component only
   * about the changes in the route segment that activated the component in
   * question. However, it is possible to activate ActivatedRoute instances for
   * all route segments for both top-level and all children routes using the
   * ActivatedRoute.pathFromRoute property. For usage of this see constructor
   * in product-count.component.ts.
   */
  {
    path: "table/:category",
    component: ProductTableComponent,
    children: [
      { path: "products", component: ProductCountComponent },
      { path: "categories", component: CategoryCountComponent },
      { path: "", component: ProductCountComponent }
    ]
  },

  /**
   * Similar to the route with the "table" path with key difference that
   * this route also has the category route parameter so will match URLs
   * like /table/clothes for example. This is used to filter products by
   * the category.
   */
  { path: "table/:category", component: ProductTableComponent},

  /**
   * The following illustrates how to redirect one route to a different
   * URL. The route below matches any URL whose first segment is "create".
   * This is because `pathMatch` property is set to "prefix", meaning that
   * only the first segment must match the route path. Hence, a URL
   * /create/this/is/ignored matches the route below which is then redirected
   * to /form/create.
   *
   * @note The /form/create URL matches { path: "form/:mode", component: ProductFormComponent }
   * route.
   */
  { path: "create", redirectTo: "/form/create", pathMatch: "prefix" },

  /**
   * The following route will match an empty URL and the route is then
   * redirected to the "table" URL. Note that setting `pathMatch` to
   * "full" means that the route matches only those URLs that in its
   * entirety match the route path. This has no consequence here as the
   * route path is empty.
   *
   * @note The /table URL matches { path: "table", component: ProductTableComponent }
   * route
   */
  { path: "", redirectTo: "table", pathMatch: "full" },

  /**
   * The following is a catch-all route that will match if none of
   * the above routes are matched first. The wildcard is used to
   * match any URL or URL segment in a route.
   */
  { path: "**", component: NotFoundComponent }
];

/**
 * The RouterModule.forRoot() method is used to create a NgModule
 * object that bakes in the routes as well as the Router service
 * instance that actually performs that routing and navigation.
 *
 * @note There can be only one active Router service at one time
 * in an Angular application. Hence RouterModule.forRoot is used
 * only when one wishes to allocate the new Router service. In
 * other cases such as when adding child module routes to the
 * root module one case use RouterModule.forChild() method which does
 * not include the Router service instance (meaning that they will
 * use the existing Router service instance).
 */
export const routing = RouterModule.forRoot(routes);
