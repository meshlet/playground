import { Injectable, Inject } from "@angular/core";
import { DataSourceInterfaceModel, DATA_SOURCE } from "./data-source-interface.model";
import { ProductModel } from "./product.model";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";

/**
 * This service is used to prevent route activates of certain routes
 * before the initial data load from the server. This improves user
 * experience by notifying them that data is not yet available (instead
 * of rendering uncompleted UI that doesn't contain Product data).
 */
@Injectable()
export class DataResolverService implements Resolve<ProductModel[]>{
  constructor(@Inject(DATA_SOURCE) private dataSource: DataSourceInterfaceModel) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<ProductModel[]> | ProductModel[] {
    /**
     * The Angular routing system's resolve feature expects that Observable
     * returned from the resolver's `resolve` method completes, before it will
     * allow the given route to be activated. The Observable gets completed by
     * invoking the Observer.complete() method after which no more events will
     * be signalled. However, the Observable returned by this.dataSource.getData()
     * will never complete, hence the route with resolver set to DataResolverService
     * would never be activated. This is why the code below pipes the RxJS's first
     * operator to create a new Observable that will complete once the value received
     * through the this.dataSource.getData() is not NULL (indicating that data has been
     * received from the server). Once this happens, the Observable returned by the
     * `first` method completes, and Angular will activate the given route.
     *
     * @note The type assertion of result from DataSourceInterfaceModel.getData()
     * is safe because the other possible type is Observable<ProductModel[]> so
     * Observable<ProductModel[] | null> includes that one. The type assertion is
     * needed because TypeScript doesn't allow invoking pipe() method on union of
     * Observable types.
     *
     * @note Type assertion that informs compiler to treat the Observable output from
     * pipe method as Observable<ProductModel[]> is safe because the first operator
     * ensures that Observable will be resolved with a non-null value, so the type must
     * be ProductModel[].
     */
    return (this.dataSource.getData() as Observable<ProductModel[] | null>)
        .pipe(first(value => value !== null)) as Observable<ProductModel[]>
  }
}
