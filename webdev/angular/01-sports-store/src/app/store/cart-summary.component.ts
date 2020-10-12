/**
 * The cart summary component.
 */
import { Component } from '@angular/core';
import { Cart } from '../model/cart.model';

@Component({
  selector: 'app-cart-summary',
  templateUrl: 'cart-summary.component.html'
})
export class CartSummaryComponent {
  constructor(private cart: Cart) {}

  get Cart(): Cart {
    return this.cart;
  }
}
