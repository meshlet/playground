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
import { HttpClient } from "@angular/common/http";
import { ProductModel } from "./product.model";
import { Observable } from "rxjs";
import { DataSourceInterfaceModel } from "./data-source-interface.model";

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
   */
  saveProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.url, product);
  }

  /**
   * Note that a product object is included in the body of the response
   * to the PUT request. This is the representation of the data that
   * was just updated by the server (i.e. an official version) and Observable
   * gets resolved with this object.
   */
  updateProduct(product: ProductModel): Observable<ProductModel> {
    // The following line would update the given product using a PUT
    // HTTP method:
    // return this.http.put<ProductModel>(`${this.url}/${product.id}`, product);

    // However, the same can be done using the HttpClient.request method
    // as shown below. This can be used to consolidate HTTP requests, so
    // that instead of invoking different HttpClient methods for different
    // HTTP verbs, one creates a wrapper around HttpClient.request:
    //
    // sendRequest<T>(verb: string, url: string, body?: Product): Observable<Product> {
    //   return this.http.request<T>(verb, url, {
    //     body: body
    //   });
    // }
    //
    // In this way, all requests are sent using the `sendRequest` wrapper.
    return this.http.request<ProductModel>(
      "PUT",
      `${this.url}/${product.id}`,
      {
        body: product
      });
  }

  /**
   * Note that a product object is included in the body of the response
   * to the DELETE request. This is the representation of the data that
   * was just deleted by the server (i.e. an official version) and Observable
   * gets resolved with this object.
   */
  deleteProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.delete<ProductModel>(`${this.url}/${product.id}`)
  }
}
