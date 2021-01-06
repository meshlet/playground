/**
 * Component for the template that lists all orders and lets
 * an admin cancel or mark the order as shipped.
 */
import { Component } from '@angular/core';
import { OrderRepository } from '../model/order.repository';
import { Order } from '../model/order.model';

@Component({
  templateUrl: 'order-table.component.html'
})
export class OrderTableComponent {
  displayShippedOrders = false;

  constructor(public repository: OrderRepository) {
  }

  public markShipped(order: Order): void {
    order.shipped = true;
    this.repository.updateOrder(order);
  }

  public deleteOrder(order: Order): void {
    this.repository.deleteOrder(order);
  }
}
