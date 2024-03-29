import {Routes, RouterModule} from "@angular/router";
import { ProductFormComponent } from "./core/product-form.component";
import { ProductTableComponent } from "./core/product-table.component";
import { NotFoundComponent } from "./core/not-found.component";
import { ProductCountComponent } from "./core/product-count.component";
import { CategoryCountComponent } from "./core/category-count.component";
import { DataResolverService } from "./model/data-resolver.service";
import { TermsGuardService } from "./terms-guard.service";
import { UnsavedChangesGuardService } from "./core/unsaved-changes-guard.service";
import { LoadGuardService } from "./load-guard.service";
import { RoutingAndNavigationComponent } from "./routing-and-navigation.component";

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
export const routes: Routes = [
  /**
   * All the routes are made children of the route whose component is the
   * RoutingAndNavigationComponent because we want Angular to allocate
   * an instance of this component as well.
   */
  {
    path: "",
    component: RoutingAndNavigationComponent,
    children: [
      /**
       * @note The following (and most of the other routes) uses the Route.resolve
       * property to delay activation of the given route until the given resolver
       * (DataResolverService) gives indication that it's ready. Resolver does this
       * by returning an Observable to which Angular subscribes, and once observable
       * completes (meaning there will be no more events coming) Angular will activate
       * the given route. For details see model/data-resolver.service.ts. Note that
       * routes for both ProductFormComponent and ProductTableComponent use the
       * resolver as both need the data that needs to be loaded from the server.
       */
      {
        path: "form/:mode/:id",
        component: ProductFormComponent,
        canActivate: [ TermsGuardService ],
        canDeactivate: [ UnsavedChangesGuardService ],
        resolve: { data: DataResolverService }
      },

      /**
       * The following route uses `canActivate` property to prevent route activation
       * if the guard service's condition is not satisfied. See more details in the
       * comment for the `canActivate` method in terms-guard.service.ts.
       */
      {
        path: "form/:mode",
        component: ProductFormComponent,
        canActivate: [ TermsGuardService ],

        /**
         * Service(s) specified in the canDeactivate property will prevent Angular
         * from deactivating the given route before the service's `canDeactivate`
         * method returns true or Promise / Observable returned from the method
         * is resolved with a true value. See core/unsaved-changes-guard.service.ts
         * for more details.
         */
        canDeactivate: [ UnsavedChangesGuardService ],
        resolve: { data: DataResolverService }
      },

      { path: "table", component: ProductTableComponent, resolve: { data: DataResolverService } },

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
        canActivateChild: [ TermsGuardService ],
        children: [
          { path: "products", component: ProductCountComponent },
          { path: "categories", component: CategoryCountComponent }
        ],
        resolve: { data: DataResolverService }
      },

      /**
       * The following route also contains child routes, however in this case
       * the parent route's path contains route parameters. The important point
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
        canActivateChild: [ TermsGuardService ],
        children: [
          { path: "products", component: ProductCountComponent },
          { path: "categories", component: CategoryCountComponent },
          { path: "", component: ProductCountComponent }
        ],
        resolve: { data: DataResolverService }
      },

      /**
       * Similar to the route with the "table" path with key difference that
       * this route also has the category route parameter so will match URLs
       * like /table/clothes for example. This is used to filter products by
       * the category.
       */
      { path: "table/:category", component: ProductTableComponent, resolve: { data: DataResolverService } },

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
      { path: "create", redirectTo: "form/create", pathMatch: "prefix" },

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
       * Navigating to this route leads to dynamically loading the LazyLoadedModule defined in
       * lazy-loaded-module/lazy-loaded.module.ts. Note that all the routes defined by the
       * LazyLoadedModule are treated as child routes of this particular route that loads
       * that module (hence all the rules about child routes apply to the routes in the
       * feature module as well).
       */
      {
        path: "dynamic-module",

        /**
         * Angular will load the module only when LoadGuardServoce.canLoad method returns
         * true or Observable / Promise it returns resolves with a true value.
         */
        canLoad: [ LoadGuardService ],
        loadChildren: () => import("./lazy-loaded-module/lazy-loaded.module").then(mod => mod.LazyLoadedModule)
      },

      /**
       * The following is a catch-all route that will match if none of
       * the above routes are matched first. The wildcard is used to
       * match any URL or URL segment in a route.
       */
      { path: "**", component: NotFoundComponent }
    ]
  }
];

/**
 * The RouterModule.forChild() method is used to create a NgModule
 * object that bakes in the routes but does not include the Router
 * service instance that actually performs that routing and navigation.
 * Check the RouterModule.forRoot() usage in app.module.ts.
 *
 * @note There can be only one active Router service at one time
 * in an Angular application. Hence RouterModule.forRoot is used
 * only when one wishes to allocate the new Router service. In
 * other cases such as when adding child module routes to the
 * root module one case use RouterModule.forChild() method which does
 * not include the Router service instance (meaning that they will
 * use the existing Router service instance).
 */
export const routingAndNavigationRouting = RouterModule.forChild(routes);
