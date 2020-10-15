/**
 * Cart model class.
 */
import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable()
export class Cart {
  private cartLines: CartLine[] = [];
  private itemCount = 0;
  private cartPrice = 0;

  private recalculate(): void {
    this.itemCount = 0;
    this.cartPrice = 0;
    this.cartLines.forEach(line => {
      this.itemCount += line.Quantity;
      this.cartPrice += line.LineTotal;
    });
  }

  addLine(product: Product, quantity: number = 1): void {
    // Check if line with given product already exists
    const cartLine = this.cartLines.find(line => line.Product.Id === product.Id);
    if (cartLine != null) {
      // Increase quantity of the existing cart line
      cartLine.Quantity += quantity;
    }
    else {
      // Create a new cart line
      this.cartLines.push(new CartLine(product, quantity));
    }

    // Recalculate the cart info
    this.recalculate();
  }

  updateQuantity(product: Product, quantity: number): void {
    // Check if line with given product already exists
    const cartLine = this.cartLines.find(line => line.Product.Id === product.Id);
    if (cartLine != null) {
      // Set the quantity of the cart line and recalculate cart info
      cartLine.Quantity = quantity < 0 ? 0 : quantity;
      this.recalculate();
    }
  }

  removeLine(product: Product): void {
    // Find index of the cart line with given product
    const index = this.cartLines.findIndex(line => line.Product.Id === product.Id);
    if (index !== -1) {
      this.cartLines.splice(index, 1);
      this.recalculate();
    }
  }

  clear(): void {
    this.cartLines = [];
    this.itemCount = 0;
    this.cartPrice = 0;
  }

  get ItemCount(): number {
    return this.itemCount;
  }

  get CartPrice(): number {
    return this.cartPrice;
  }

  get CartLines(): CartLine[] {
    return this.cartLines;
  }
}

export class CartLine {
  private product: Product;
  private quantity: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }

  get Product(): Product {
    return this.product;
  }

  get Quantity(): number {
    return this.quantity;
  }

  set Quantity(quantity: number) {
    this.quantity = quantity;
  }

  get LineTotal(): number {
    return this.product.Price * this.quantity;
  }
}
