/**
 * A data source implementation that obtains the data from
 * a Restful web service.
 *
 * TODO: the class now assumes that server runs at the same
 *       machine as the client which needs to be fixed.
 */
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Product } from './product.model';
import { Observable } from 'rxjs';
import { Order } from './order.model';
import { map } from 'rxjs/operators';
import { Injector } from '@angular/core';
import { Cart } from './cart.model';
import { HttpHeaders } from '@angular/common/http';

// TODO: both protocol and port should be globally configured.
//       Current values match the run-config of the json-server
//       used in testing
const PROTOCOL = 'http';
const PORT = 3500;

@Injectable()
export class RestDatasource {
  private baseUrl = '';
  private authToken?: string;

  constructor(private httpClient: HttpClient, private injector: Injector) {
    this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
  }

  authenticate(username: string, password: string): Observable<boolean> {
    return this.httpClient.post<any>(this.baseUrl + 'login', {
      name: username, password
    }).pipe(map(response => {
      this.authToken = response.success ? response.token : undefined;
      return response.success;
    }));
  }

  getProducts(): Observable<Product[]> {
    /**
     * TODO: Objects returned by HttpClient are plain JavaScript
     *  objects and do not have the actual type indicated by TS.
     *  For example, if Product class has some getter properties
     *  the objects returned by HttpClient.get method will not
     *  have these properties. The following code works around
     *  this by re-creating each product with the actual Product
     *  type. This is ugly and perhaps it is better to instead
     *  have models as POD classes without any methods.
     */
    return this.httpClient.get<any[]>(this.baseUrl + 'products')
      .pipe(map(products => {
        return products.map(
          p => new Product(p.id, p.name, p.category, p.description, p.price));
      }));
  }

  saveProduct(product: Product): Observable<Product> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.post<any>(this.baseUrl + 'products',
      product, this.getOptions())
      .pipe(map(p => {
        const result = new Product(p.id, p.name, p.category, p.description, p.price);
        return result;
      }));
  }

  updateProduct(product: Product): Observable<Product> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.put<any>(`${this.baseUrl}products/${product.id}`,
      product, this.getOptions())
      .pipe(map(p => {
        const result = new Product(p.id, p.name, p.category, p.description, p.price);
        return result;
      }));
  }

  deleteProduct(product: Product): Observable<Product> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.delete<any>(`${this.baseUrl}products/${product.id}`,
      this.getOptions())
      .pipe(map(p => {
        const result = new Product(p.id, p.name, p.category, p.description, p.price);
        return result;
      }));
  }

  getOrders(): Observable<Order[]> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.get<any[]>(this.baseUrl + 'orders',
      this.getOptions())
      .pipe(map(orders => {
        return orders.map(o => {
          const result = new Order(new Cart());
          Object.assign(result, o);
          // const result = new Order(this.injector.get(Cart));
          // result.Id = o.id;
          // result.FirstName = o.firstName;
          // result.LastName = o.lastName;
          // result.Address = o.address;
          // result.Country = o.country;
          // result.City = o.city;
          // result.State = o.state;
          // result.Zip = o.zip;
          // result.Shipped = o.shipped;

          return result;
        });
      }));
  }

  saveOrder(order: Order): Observable<Order> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.post<any>(this.baseUrl + 'orders', order)
      .pipe(map(o => {
        const result = new Order(new Cart());
        Object.assign(result, o);
        // const result = new Order(this.injector.get(Cart));
        // result.Id = o.id;
        // result.FirstName = o.firstName;
        // result.LastName = o.lastName;
        // result.Address = o.address;
        // result.Country = o.country;
        // result.City = o.city;
        // result.State = o.state;
        // result.Zip = o.zip;
        // result.Shipped = o.shipped;

        return result;
      }));
  }

  updateOrder(order: Order): Observable<Order> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.put<any>(`${this.baseUrl}orders/${order.id}`,
      order, this.getOptions())
      .pipe(map(o => {
        const result = new Order(new Cart());
        Object.assign(result, o);
        // const result = new Order(this.injector.get(Cart));
        // result.Id = o.id;
        // result.FirstName = o.firstName;
        // result.LastName = o.lastName;
        // result.Address = o.address;
        // result.Country = o.country;
        // result.City = o.city;
        // result.State = o.state;
        // result.Zip = o.zip;
        // result.Shipped = o.shipped;

        return result;
      }));
  }

  deleteOrder(order: Order): Observable<Order> {
    // TODO: the same comment as in `getProducts` method
    return this.httpClient.delete<any>(`${this.baseUrl}orders/${order.id}`,
      this.getOptions())
      .pipe(map(o => {
        const result = new Order(new Cart());
        Object.assign(result, o);
        // const result = new Order(this.injector.get(Cart));
        // result.Id = o.id;
        // result.FirstName = o.firstName;
        // result.LastName = o.lastName;
        // result.Address = o.address;
        // result.Country = o.country;
        // result.City = o.city;
        // result.State = o.state;
        // result.Zip = o.zip;
        // result.Shipped = o.shipped;

        return result;
      }));
  }

  private getOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer<${this.authToken}>`
      })
    };
  }

  getAuthToken(): string | undefined {
    return this.authToken;
  }

  resetAuthToken(): void {
    this.authToken = undefined;
  }
}
