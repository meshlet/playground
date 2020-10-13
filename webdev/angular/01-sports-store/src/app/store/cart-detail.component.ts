/**
 * Cart detail component.
 */
import { Component } from '@angular/core';
import { Cart } from '../model/cart.model';

@Component({
  templateUrl: 'cart-detail.component.html'
})
export class CartDetailComponent {
  constructor(private cart: Cart) {}

  get Cart(): Cart {
    return this.cart;
  }
}
