/**
 * Simple services that are used to illustrate different service providers
 * and their capabilities.
 */

import { Injectable, InjectionToken } from "@angular/core";

@Injectable()
export class SimpleService1 {
  getServiceString(): string {
    return "Simple service 1";
  }
}

/**
 * The `InjectionToken` class gives a way to create a unique token for the
 * given service, instead of using simple string tokens. This is because
 * string tokens can clash with each other if they are equal, while two
 * InjectionToken instances can never be equal (different objects in memory,
 * hence comparison of two instances will always yield false). Note the
 * const keyword so that TypeScript will throw an error if object is
 * re-assigned.
 */
export const SIMPLE_SERVICE_2 = new InjectionToken("simple_service_2");

@Injectable()
export class SimpleService2 {
  getServiceString(): string {
    return "Simple service 2";
  }
}

@Injectable()
export class SimpleService3 {
  getServiceString(): string {
    return "Simple service 3";
  }
}

@Injectable()
export class SimpleService4 {
  getServiceString(): string {
    return "Simple service 4";
  }
}

@Injectable()
export class SimpleService5 {
  getServiceString(): string {
    return "Simple service 5";
  }
}

@Injectable()
export class SimpleService6 {
  getServiceString(): string {
    return "Simple service 6";
  }
}

/**
 * An opaque token used to setup multiple related providers with the `multi = true`
 * so that Angular will create an array of services and pass that array to the
 * dependent component. See
 */
export const SERVICE_ARRAY = new InjectionToken("service_array");

/**
 * An opaque token used to identify the dependency to be resolved by a value
 * service provider.
 */
export const VALUE_SERVICE = new InjectionToken("value_service");
