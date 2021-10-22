import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LazyLoadedComponent } from "./lazy-loaded.component";
import {FirstComponent} from "./first.component";
import {SecondComponent} from "./second.component";
import {ThirdComponent} from "./third.component";

/**
 * A simple feature module that is dynamically loaded by the RoutingAndNavigationModule
 * (defined in routing-and-navigation.module.ts).
 *
 * @note Note that this module imports CommonModule instead of the BrowserModule.
 * BrowserModule is intended to be imported by the root module of the applications
 * that run in the browser. Feature modules (including the ones that will be lazily
 * loaded) should import CommonModule to get access too common directives and
 * services (i.e. ngIf, ngFor etc). Importing BrowserModule to a lazily loaded module
 * will result in an error reported by Angular. More info can be found at:
 *
 * https://angular.io/guide/frequent-ngmodules#browsermodule-and-commonmodule
 *
 * @note Note that routing configuration is created with RouterModule.forChild instead
 * of RouterModule.forRoot method. `forRoot` is intended to be used by the root
 * module and includes an instance of the Router service. As there can be only one
 * active Router instance at any time, all feature modules are suppoed to use the
 * `forChild` method which doesn't include the Router service. More info here:
 *
 * https://angular.io/guide/lazy-loading-ngmodules#forroot-and-forchild
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: LazyLoadedComponent,
        children: [
          /**
           * Notice the use of the `outlet` Route property in these route definitions.
           * The route with `outlet: "primary"` will target the router outlet element
           * without the name (or with the name "primary"), because router outlets
           * without a defined name in the template (see lazy-loaded.component.html)
           * are given the name "primary". Note that omitting the outlet property
           * in the case where outlet name is "primary" would work - Angular would
           * then look for the nameless router outlet (or the one named "primary").
           *
           * Routes with outlet set to "left" and "right" target router outlet elements
           * with those names.
           */
          { path: "", outlet: "primary", component: FirstComponent },
          { path: "", outlet: "left", component: SecondComponent },
          { path: "", outlet: "right", component: ThirdComponent }
        ]
      },

      {
        path: "reversed",
        component: LazyLoadedComponent,
        children: [
          { path: "", outlet: "primary", component: ThirdComponent },
          { path: "", outlet: "left", component: SecondComponent },
          { path: "", outlet: "right", component: FirstComponent }
        ]
      }
    ])
  ],
  declarations: [ LazyLoadedComponent, FirstComponent, SecondComponent, ThirdComponent ]
})
export class LazyLoadedModule {
}
