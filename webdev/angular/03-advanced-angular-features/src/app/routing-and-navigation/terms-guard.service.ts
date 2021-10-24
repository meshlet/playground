import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlSegment
} from "@angular/router";
import { Observer } from "rxjs";
import {HeaderMessageService, HeaderMessageEventDataType} from "../header-message/header-message.service";

@Injectable()
export class TermsGuardService implements CanActivate, CanActivateChild {
  constructor(private headerMsgService: HeaderMessageService, private router: Router) {
  }

  /**
   * This class implements the CanActivate interface hence can be used
   * to guard routes from activation. The route to which this guard has
   * been applied can only be activated when the `canActivate` method
   * returns true or if the Promise (or alternatively an Observable,
   * but that's not illustrated here) is resolved with a true value.
   * Otherwise (method returns false or Promise/Observable is resolved
   * with a false value) the route transition is ignored.
   *
   * This particular CanActivate service is applied only to routes with
   * the `mode` parameter set to `create` (should affect only the routes
   * that lead to new product creation). For these routes, the method
   * returns a Promise that will be resolved whenever the listener to
   * the events coming from `userInputObserver` invokes one of the callbacks
   * passed to the `userInputObserver.next()` method. In this particular
   * case, this will be done in the RoutingAndNavigationComponent defined
   * in (routing-and-navigation.component.ts). For all the other routes
   * the method returns true, which leads to their immediate activation.
   * This is important as we don't want to delay activation of other
   * routes.
   *
   * @note Note that when Observable is used instead of Promise, it has
   * to actually complete (for example, by calling the complete() method)
   * for the route to be activated. This is explained in more detail in
   * model/data-resolver.service.ts.
   */
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> | boolean {
    if (route.params["mode"] === "create") {
      return new Promise<boolean>(resolve => {
        const eventData: HeaderMessageEventDataType = {
          message: "Do you accepts terms and conditions?",
          responses: [
            { answer: "Yes", callbackFn: () => resolve(true) },
            { answer: "No", callbackFn: () => resolve(false) }
          ]
        };
        this.headerMsgService.sendMsg(eventData);
      });
    }
    else {
      return true;
    }
  }

  /**
   * Similar to the `canActivate` method, however the canActivateChild guard is
   * applied to child routes of a given parent route. For an example of this
   * check routing-and-navigation.routing.ts. When a canActivateChild route guard
   * is used in a parent route, Angular will activate any of the child routes
   * only if the method below returns true or a Promise / Observable it returns
   * get resolved with a true value. Otherwise (method returns false or Promise /
   * Observable it returns resolves with a false value), Angular will ignore
   * the navigation.
   */
  canActivateChild(childRoute: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Promise<boolean> | boolean {
    /**
     * We only one to guard the routes that contain the "categories" segment. It is
     * important to remember that the ActivatedRouteSnapshot passed here includes
     * only the child route's URL segments. Hence, if a full URL is /table/products
     * but /table is matched to the parent route, the childRoute.url will only
     * contain one URL segment whose path is "categories".
     */
    if (childRoute.url.length > 0 && childRoute.url[childRoute.url.length - 1].path === "categories") {
      return new Promise<boolean>(resolve => {
        const eventData: HeaderMessageEventDataType = {
          message: "Do you want to view the categories component",
          responses: [
            { answer: "Yes", callbackFn: () => resolve(true) },
            { answer: "No", callbackFn: () => {
              resolve(false);

              // If user answered with "No", we want to show the ProductCountComponent
              // (defined in product-count.component.ts). However, as the childRoute
              // only contains the URL segments for this particular child route, we
              // have to rebuild the entire URL starting from the root route and also
              // replace the "categories" with the "products" URL segment.
              this.router.navigateByUrl(
                childRoute.pathFromRoot.map(
                  (routeSnapshot: ActivatedRouteSnapshot) => {
                    return routeSnapshot.url
                      .map((value: UrlSegment) =>
                        value.path === "categories" ? "products" : value.path)
                      .join("/")
                  }
                ).join("/"));
            }}
          ]
        };
        this.headerMsgService.sendMsg(eventData);
      });
    }
    else {
      return true;
    }
  }
}
