/**
 * Cart detail component.
 */
import { Component } from '@angular/core';
import { Cart } from '../model/cart.model';
import { ConnectivityService } from '../model/connectivity.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'cart-detail.component.html'
})
export class CartDetailComponent {
  constructor(private cart: Cart, public connService: ConnectivityService, private router: Router) {
  }

  checkout(): void {
    // Filter out Cart lines whose quanitity is zero
    this.cart.removeLinesWithZeroQuantity();

    // Proceed to checkout component
    this.router.navigateByUrl('/checkout');
  }

  get Cart(): Cart {
    return this.cart;
  }
}
