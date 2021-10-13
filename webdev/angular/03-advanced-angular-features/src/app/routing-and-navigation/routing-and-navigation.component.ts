import { Component } from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: "routing-and-navigation",
  templateUrl: "routing-and-navigation.component.html"
})
export class RoutingAndNavigationComponent {
  public completedNavigationsCount = 0;

  /**
   * Router service exposes the `events` Observable that can be used
   * to listen to navigation events. There are several types of these
   * events that are reported, and the code in constructor filters out
   * all the other events except the NavigationEnd which is signaled
   * when a new route becomes active (navigation completes).
   */
  constructor(private router: Router) {
    router.events
      .pipe(filter((e => e instanceof NavigationEnd)))
      .subscribe(e => ++this.completedNavigationsCount);
  }
}
