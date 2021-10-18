import { Injectable, Inject } from "@angular/core";
import { DataSourceInterfaceModel, DATA_SOURCE } from "./data-source-interface.model";
import { ProductModel } from "./product.model";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable, Subject, of} from "rxjs";
import {first, map} from "rxjs/operators";

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
     * @todo explain how this works
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
