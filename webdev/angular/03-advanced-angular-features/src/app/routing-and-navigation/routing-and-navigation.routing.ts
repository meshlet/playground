import { Routes, RouterModule } from "@angular/router";
import { ProductFormComponent } from "./core/product-form.component";
import { ProductTableComponent } from "./core/product-table.component";

/**
 * The following describes the routes using the Routes collection.
 * Thus when Angular encounters the "form/edit" URL, it knows to
 * load the ProductFormComponent for example.
 *
 * @note The order in which routes are defined matters. Angular
 * examines each of these in turn when matching the URL to the
 * route, hence the more specific routes should be defined first
 * followed by those that have lower specificity.
 */
const routes: Routes = [
  { path: "form/edit", component: ProductFormComponent },
  { path: "form/create", component: ProductFormComponent },
  { path: "", component: ProductTableComponent }
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
