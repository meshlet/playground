import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {HeaderMessageService} from "./header-message/header-message.service";

@Component({
  selector: "app",
  templateUrl: "app.component.html"
})
export class AppComponent {
  /**
   * Matches the currently active side-menu button. Indexing with
   * ngbNavItem (in app.component.html) starts with "1" hence we
   * set default to "0" to make sure that now buttons are highlighted
   * before the first navigation completes, at which point the
   * correct button is highlighted.
   */
  public active = "0";

  /**
   * Map top-level URL segments to active IDs.
   *
   * @note Generation of this map should be automated by obtaining Router
   * configuration and reading all existing top-level URL segments.
   */
  private static routesToActive: { [key: string]: string } = {
    "rxjs-async-http-samples": "1",
    "routing-samples": "2",
    "animation-samples": "3",
    "additional-samples": "4"
  };

  constructor(router: Router, private route: ActivatedRoute) {
    /**
     * Determine the active side-menu button from the active route the
     * first time a navigation ends. This makes sure that the current
     * matches matches the highlighted button even if user manually enters
     * a route URL.
     */
    router.events
      .pipe(filter((e => e instanceof NavigationEnd)))
      .subscribe(() => {
        let newActiveId = "0";
        if (route.snapshot.firstChild &&
          AppComponent.routesToActive.hasOwnProperty(route.snapshot.firstChild.url[0].path)) {
          newActiveId = AppComponent.routesToActive[route.snapshot.firstChild.url[0].path];
        } else {
          newActiveId = "1";
        }

        /**
         * Update the current active ID only if it was set to "0", indicating
         * that this is the first completed navigation.
         */
        if (this.active === "0") {
          this.active = newActiveId;
        }
      });
  }
}
