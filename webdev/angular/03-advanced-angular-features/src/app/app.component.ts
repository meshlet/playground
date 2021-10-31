import {Component, QueryList, ViewChildren, AfterViewInit} from "@angular/core";
import {NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {HeaderMessageService} from "./header-message/header-message.service";
import {NgbNavLink} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app",
  templateUrl: "app.component.html"
})
export class AppComponent implements AfterViewInit {
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
    "angular-unit-testing": "4",
    "additional-samples": "5"
  };

  constructor(router: Router, public msgService: HeaderMessageService) {
    /**
     * Determine the active side-menu button from the active route the
     * first time a navigation starts. This makes sure that the current
     * route matches matches the highlighted button even if user manually
     * enters a route URL.
     */
    router.events
      .pipe(filter((e => e instanceof NavigationStart)))
      .subscribe((e) => {
        // 'e' is certainly of NavigationStart type due to the filter operator piped in earlier
        const url = (e as NavigationStart).url;
        const secondForwardSlashIndex = url.indexOf("/", 1);
        const topLevelUrlSegment: string =
          url.substring(1, secondForwardSlashIndex === -1 ? undefined : secondForwardSlashIndex);

        let newActiveId = "0";
        if (AppComponent.routesToActive.hasOwnProperty(topLevelUrlSegment)) {
          newActiveId = AppComponent.routesToActive[topLevelUrlSegment];
        } else {
          newActiveId = "1";
        }

        /**
         * Update the current active ID only if it was set to "0", indicating
         * that this is the very first navigation.
         */
        if (this.active === "0") {
          this.active = newActiveId;
        }
      });
  }

  /**
   * Query all children to which the NgbNavLink directive has been applied.
   */
  @ViewChildren(NgbNavLink)
  // Assigned by Angular right before invoking the `ngAfterViewInit` method
  // @ts-ignore
  ngbNavLinks: QueryList<NgbNavLink>;

  /**
   * Set a click listener to every element in the view with the NgbNavLink
   * directive. This click listener clears the header message to avoid having
   * stale messages when user switches between different samples.
   */
  ngAfterViewInit(): void {
    this.ngbNavLinks.forEach(item => {
      (item.elRef.nativeElement as HTMLElement).addEventListener("click", () => {
        this.msgService.sendMsg(null);
      });
    });
  }
}
