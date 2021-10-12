/**
 * This is a Angular service that uses HTTP to obtain data from a RESTful
 * web service.
 *
 * @note HttpClient methods that create an HTTP request (i.e. get, post,
 * request etc.) return an Observable that will yield an object with
 * the specified type once the request completes. However, these methods
 * (for example HttpClient.get()) don't themselves send the request to
 * the server. This happens when one invokes the `subscribe()` method
 * of the Observable returned by these HttpClient methods. More specifically,
 * each time `subscribe` is called a new HTTP request is sent, so one
 * has to be careful to avoid sending the same request multiple times
 * unnecessarily.
 */
import {Injectable, Inject, InjectionToken} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { ProductModel } from "./product.model";
import {Observable, throwError} from "rxjs";
import { DataSourceInterfaceModel } from "./data-source-interface.model";
import { catchError } from "rxjs/operators";

/**
 * Define an opaque token used to inject the RESTful URL to this
 * service.
 */
export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSourceModel implements DataSourceInterfaceModel {
  constructor(private http: HttpClient, @Inject(REST_URL) private url: string) {
  }

  getData(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.url);
  }

  /**
   * Note that a product object is included in the body of the response
   * to the POST request. This is the representation of the data that
   * was just saved by the server (i.e. an official version) and Observable
   * gets resolved with this object.
   *
   * @note The `catchError` RxJS operator passes the events along until
   * an error occurs at which point it invokes the provided callback.
   * The callback provided to catchError *MUST* return another Observable
   * instance, to which the catchError method will subscribe to. The
   * `throwError` function creates a failed Observable as a way of
   * reporting the error to the subscribers.
   */
  saveProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.url, product)
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }));
  }

  /**
   * Note that a product object is included in the body of the response
   * to the PUT request. This is the representation of the data that
   * was just updated by the server (i.e. an official version) and Observable
   * gets resolved with this object.
   */
  updateProduct(product: ProductModel): Observable<ProductModel> {
    /**
     * The following line would update the given product using a PUT
     * HTTP method:
     *
     * return this.http.put<ProductModel>(`${this.url}/${product.id}`, product);
     *
     * However, the same can be done using the HttpClient.request method
     * as shown below. This can be used to consolidate HTTP requests, so
     * that instead of invoking different HttpClient methods for different
     * HTTP verbs, one creates a wrapper around HttpClient.request:
     *
     * sendRequest<T>(verb: string, url: string, body?: Product): Observable<Product> {
     *   return this.http.request<T>(verb, url, {
     *     body: body
     *   });
     * }
     *
     * In this way, all requests are sent using the `sendRequest` wrapper.
     *
     * @note The configuration object accepted by the HttpClient.request method
     * has the `headers` property where one can pass in the HttpHeaders instance
     * defining additional HTTP headers to be sent to the server. This is illustrated
     * below.
     */

    // Create an HttpHeaders object with additional headers to include in the HTTP
    // request. Note that HttpHeaders.set method accepts an array in case where HTTP
    // option has multiple values (i.e. Application-Names: advanced-angular-features, second-name)
    const headers = new HttpHeaders();
    headers.set("Access-Key", "something-secret-and-unique");
    headers.set("Application-Names", ["advanced-angular-features", "second-name"]);

    return this.http.request<ProductModel>(
      "PUT",
      `${this.url}/${product.id}`,
      {
        body: product,
        headers: headers
      })
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }));
  }

  /**
   * Note that a product object is included in the body of the response
   * to the DELETE request. This is the representation of the data that
   * was just deleted by the server (i.e. an official version) and Observable
   * gets resolved with this object.
   */
  deleteProduct(id: number): Observable<ProductModel> {
    return this.http.delete<ProductModel>(`${this.url}/${id}`)
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }));
  }
}
