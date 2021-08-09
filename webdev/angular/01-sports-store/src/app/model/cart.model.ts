/**
 * Cart model class.
 */
import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable()
export class Cart {
  public cartLines: CartLine[] = [];
  public itemCount = 0;
  public cartPrice = 0;

  private recalculate(): void {
    this.itemCount = 0;
    this.cartPrice = 0;
    this.cartLines.forEach(line => {
      this.itemCount += line.quantity;
      this.cartPrice += line.getLineTotal();
    });
  }

  addLine(product: Product, quantity: number = 1): void {
    // Check if line with given product already exists
    const cartLine = this.cartLines.find(line => line.product.id === product.id);
    if (cartLine != null) {
      // Increase quantity of the existing cart line
      cartLine.quantity += quantity;
    }
    else {
      // Create a new cart line
      this.cartLines.push(new CartLine(product, quantity));
    }

    // Recalculate the cart info
    this.recalculate();
  }

  /**
   * @note quantity is string here as this method is used to pass
   * the value of a form text input field whose value is of string
   * type. TypeScript wouldn't complain if quantity parameter was
   * a number, because the code that passes form text input value
   * to this method is in JavaScript land. However, the parameter
   * would still need to be explicitly cast to a number in this
   * method.
   */
  updateQuantity(product: Product, quantityStr: string): void {
    const quantity = Number(quantityStr);

    // Check if line with given product already exists
    const cartLine = this.cartLines.find(line => line.product.id === product.id);
    if (cartLine != null) {
      // Set the quantity of the cart line and recalculate cart info
      cartLine.quantity = quantity < 0 ? 0 : quantity;
      this.recalculate();
    }
  }

  removeLine(product: Product): void {
    // Find index of the cart line with given product
    const index = this.cartLines.findIndex(line => line.product.id === product.id);
    if (index !== -1) {
      this.cartLines.splice(index, 1);
      this.recalculate();
    }
  }

  removeLinesWithZeroQuantity(): void {
    this.cartLines = this.cartLines.filter(line => line.quantity > 0);
  }

  clear(): void {
    this.cartLines = [];
    this.itemCount = 0;
    this.cartPrice = 0;
  }
}

export class CartLine {
  public readonly product: Product;
  public quantity: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }

  getLineTotal(): number {
    return this.product.price * this.quantity;
  }
}
