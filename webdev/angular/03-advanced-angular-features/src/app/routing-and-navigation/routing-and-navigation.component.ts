import { Component, Inject, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { DataSourceInterfaceModel, DATA_SOURCE } from "./model/data-source-interface.model";
import { HeaderMessageService } from "../header-message/header-message.service";
import { Subscription } from "rxjs";

@Component({
  selector: "routing-and-navigation",
  templateUrl: "routing-and-navigation.component.html"
})
export class RoutingAndNavigationComponent implements OnDestroy {
  public completedNavigationsCount = 0;
  private navigationSubscription: Subscription;

  /**
   * Router service exposes the `events` Observable that can be used
   * to listen to navigation events. There are several types of these
   * events that are reported, and the code in constructor filters out
   * all the other events except the NavigationEnd which is signaled
   * when a new route becomes active (navigation completes).
   */
  constructor(router: Router,
              @Inject(DATA_SOURCE) dataSource: DataSourceInterfaceModel,
              private headerMsgService: HeaderMessageService) {

    this.navigationSubscription = router.events
      .pipe(filter((e => e instanceof NavigationEnd)))
      .subscribe(e => {
        ++this.completedNavigationsCount;
        this.headerMsgService.sendMsg({
          message: `The number of completed navigations: ${this.completedNavigationsCount}`
        })
      });
  }

  /**
   * Once component is destroyed, unsubscribe from the navigation event changes
   * and clear the message on top of the page so that other components not using
   * the header don't have to do that themselves.
   */
  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
    this.headerMsgService.sendMsg(null);
  }
}
