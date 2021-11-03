import {Injectable, InjectionToken} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { ProductModel } from "./product.model";
import { Observable, throwError} from "rxjs";
import { catchError } from "rxjs/operators";

/**
 * Define an opaque token used to inject the RESTful URL to this
 * service.
 */
export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSourceModel {
  private url: string = "/dummy-url";

  constructor(private http: HttpClient) {
  }

  getData(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.url)
  }

  saveProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.url, product)
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }));
  }

  updateProduct(product: ProductModel): Observable<ProductModel> {
    const headers = new HttpHeaders();
    headers.set("Access-Key", "something-secret-and-unique");
    headers.set("Application-Names", ["advanced-angular-features", "second-name"]);

    return this.http.put<ProductModel>(`${this.url}/${product.id}`, product)
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }));
  }

  deleteProduct(id: number): Observable<ProductModel> {
    return this.http.delete<ProductModel>(`${this.url}/${id}`)
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }));
  }
}
