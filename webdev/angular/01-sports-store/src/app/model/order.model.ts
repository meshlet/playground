/**
 * Represents the order.
 */
import { Injectable } from '@angular/core';
import { Cart } from './cart.model';

@Injectable()
export class Order {
  public id?: number = undefined;
  public firstName = '';
  public lastName = '';
  public address = '';
  public country = '';
  public city = '';
  public state = '';
  public zip = '';
  public shipped = false;

  constructor(public cart: Cart) {}

  clear(): void {
    this.id = undefined;
    this.firstName = this.lastName = this.address = this.country =
      this.city = this.state = this.zip = this.country = '';

    this.shipped = false;
    this.cart.clear();
  }

  /**
   * Override toJSON method so that Cart member is not sent
   * to the server.
   * TODO: This is a bug. Order must contain information about its products.
   *       So either `Cart` member must be included when data is sent to the
   *       server, or `Cart` can be manually serialized here so that can be
   *       sent to the server instead.
   */
  // toJSON(): any {
  //   return {
  //     id: this.id,
  //     firstName: this.firstName,
  //     lastName: this.lastName,
  //     address: this.address,
  //     country: this.country,
  //     city: this.city,
  //     state: this.state,
  //     zip: this.zip,
  //     shipped: this.shipped
  //   };
  // }
}
