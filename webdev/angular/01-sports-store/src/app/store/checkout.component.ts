/**
 * Store checkout component.
 */
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Order } from '../model/order.model';
import { OrderRepository } from '../model/order.repository';

@Component({
  templateUrl: 'checkout.component.html'
})
export class CheckoutComponent {
  private orderSent = false;

  constructor(private orderRepository: OrderRepository,
              private order: Order) {
  }

  submitOrder(form: NgForm): void {
    if (form.valid) {
      this.orderRepository.saveOrder(this.order).subscribe(order => {
        this.order.clear();
        this.orderSent = true;
      });
    }
  }

  get OrderSent(): boolean {
    return this.orderSent;
  }

  get Order(): Order {
    return this.order;
  }
}
