import { Component, Inject } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { DataSourceInterfaceModel, DATA_SOURCE } from "./model/data-source-interface.model";
import { Observable } from "rxjs";
import { ProductModel } from "./model/product.model";
import {TERMS_GUARD_SUBJECT, TermsGuardsCallbackParamType} from "./terms-guard.service";

@Component({
  selector: "routing-and-navigation",
  templateUrl: "routing-and-navigation.component.html"
})
export class RoutingAndNavigationComponent {
  public isDataReady = false;
  public completedNavigationsCount = 0;
  public waitingForUserInput = false;
  public userInputData: TermsGuardsCallbackParamType | undefined;

  /**
   * Router service exposes the `events` Observable that can be used
   * to listen to navigation events. There are several types of these
   * events that are reported, and the code in constructor filters out
   * all the other events except the NavigationEnd which is signaled
   * when a new route becomes active (navigation completes).
   */
  constructor(router: Router,
              @Inject(DATA_SOURCE) dataSource: DataSourceInterfaceModel,
              @Inject(TERMS_GUARD_SUBJECT) userInputObservable: Observable<TermsGuardsCallbackParamType>) {

    router.events
      .pipe(filter((e => e instanceof NavigationEnd)))
      .subscribe(e => ++this.completedNavigationsCount);

    /**
     * Subscribe to the data source Observable that is signalled
     * once initial data is loaded from the server. The purpose
     * of this is to display a "Loading data..." message to the
     * user while data is not yet available, instead of an empty
     * browser window or worse UI without the data.
     *
     * @note The type assertion of result from DataSourceInterfaceModel.getData()
     * is safe because the other possible type is Observable<ProductModel[]> so
     * Observable<ProductModel[] | null> includes that one. The type assertion is
     * needed because TypeScript doesn't allow invoking pipe() method on union of
     * Observable types.
     */
    (dataSource.getData() as Observable<ProductModel[] | null>)
      .pipe(filter(value => value != null))
      .subscribe(() => this.isDataReady = true);

    /**
     * An event arriving via this Observable means that user action is needed.
     * This component will then display the received message and a list of
     * buttons that user can use to decide what to do. This is part of guarding
     * routes with TermsGuardService defined in terms-guard.service.ts.
     */
    userInputObservable.subscribe((value: TermsGuardsCallbackParamType) => {
      this.waitingForUserInput = true;
      this.userInputData = value;
    });
  }
}
