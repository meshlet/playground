import { Injectable } from "@angular/core";
import {SimpleService} from "./simple.service";

/**
 * This is a service that can be injected to components, directives pipes
 * and other services that accept it via their constructor. When Angular encounters
 * a block (component, directive, pipe or service) whose constructor contains a
 * parameter whose type is DiscountService, it checks the NgModule's
 * providers array to try and find the corresponding service class.
 *
 * If service class is found, Angular will allocate an instance of it
 * in case it hasn't allocated one before and pass it to the constructor
 * of the component, directive, pipe or a service. Hence, entire module will share
 * a single instance of the service.
 *
 * If NgModule's providers array doesn't contain the class whose type appears
 * in the constructor of a component, directive, pipe or service, Angular will throw
 * an error.
 */
@Injectable()
export class DiscountService {
  private discountValue = 10;

  /**
   * This illustrates that services can also define dependencies to
   * other services. Angular will resolve them in the same way it
   * resolves dependencies for components, directives and pipes.
   */
  constructor(private simpleService?: SimpleService) {}

  get discount(): number {
    return this.discountValue;
  }

  set discount(newValue: number) {
    this.discountValue = newValue;
  }

  applyDiscount(price: number): number {
    // Price after discount can never be less than 5 dollars
    return Math.min(price, Math.max(price - this.discountValue, 5));
  }
}
