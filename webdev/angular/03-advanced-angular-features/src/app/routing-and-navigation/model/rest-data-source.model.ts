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
import {BehaviorSubject, Observable, throwError} from "rxjs";
import { DataSourceInterfaceModel } from "./data-source-interface.model";
import { catchError } from "rxjs/operators";

/**
 * Define an opaque token used to inject the RESTful URL to this
 * service.
 */
export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSourceModel implements DataSourceInterfaceModel {
  /**
   * The subject exposed to the outside world used to subscribe to the data
   * load event but without triggering a new HTTP request. Explained in
   * more details in the comment within the class constructor.
   *
   * @note A null value is passed to the BehaviorSubject constructor
   * so that users can check whether the data has actually been loaded from
   * the server or BehaviorSubject is invoking callback upon subscription
   * before data has been loaded. Note that BehaviorSubject will do just
   * that, as soon as subscriber is registered it will invoke it with
   * whatever data it has (and it might happen that the first value returned
   * by it to a subscriber is the value passed to the constructor which is
   * why null is passed to it as a signal that data hasn't yet been loaded
   * from the server).
   */
  private dataSubject: BehaviorSubject<ProductModel[] | null> =
    new BehaviorSubject<ProductModel[] | null>(null);

  constructor(private http: HttpClient, @Inject(REST_URL) private url: string) {
    /**
     * Create and immediately send (by subscribing to the Observable) a GET HTTP
     * request to load all Products from the server.
     */
    this.http.get<ProductModel[]>(this.url)
      .pipe(catchError((error) => {
        return throwError(`Network error: ${error.statusText} ${error.status}`);
      }))
      .subscribe((products: ProductModel[]) => {
        /**
         * In order to allow multiple subscribers to subscribe to the event
         * of initial data load from the server but without initiating multiple
         * HTTP requests, this class wraps the Observable returned from the
         * HttpClient.get() method with its own BehaviorSubject. This class
         * itself subscribes to the Observable returned by HttpClient.get()
         * and signals that data has been loaded by invoking BehaviorSubject.next()
         * method. The class exposes the BehaviorSubject to the outside worlds,
         * which will pass the data from the most recent load transaction to all
         * the new subscribers even if they were registered after the event has
         * already been signalled (this is why BehaviorSubject is used here
         * instead of the base Subject class). Note that all the other methods
         * such as saveProduct() simply return the Observable returned by the
         * HttpClient as it is not expected that multiple actors will need
         * to subscribe to these Observables which yield a single Product.
         */
        this.dataSubject.next(products);
      });
  }

  getData(): Observable<ProductModel[] | null> {
    // Return the internal BehaviorSubject that will invoke all the subscribers
    // with the loaded data array. See comment in class constructor for more
    // details.
    return this.dataSubject;
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
