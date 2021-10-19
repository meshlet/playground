import { Injectable, Inject, InjectionToken } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import { Observer } from "rxjs";

export const TERMS_GUARD_SUBJECT = new InjectionToken("terms_guard_subject");
export type TermsGuardsCallbackParamType =
  { message: string, responses: [string, () => void][] };

@Injectable()
export class TermsGuardService implements CanActivate {
  constructor(
    @Inject(TERMS_GUARD_SUBJECT) private userInputObserver: Observer<TermsGuardsCallbackParamType>) {

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
        const eventData: TermsGuardsCallbackParamType = {
          message: "Do you accepts terms and conditions?",
          responses: [
            [ "Yes", () => resolve(true) ],
            [ "No", () => resolve(false) ]
          ]
        };
        this.userInputObserver.next(eventData);
      })
    }
    else {
      return true;
    }
  }
}
