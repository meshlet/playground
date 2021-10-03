import { Component, Inject } from "@angular/core";
import {
  SIMPLE_SERVICE_2,
  SERVICE_ARRAY,
  VALUE_SERVICE,
  SimpleService1,
  SimpleService2,
  SimpleService3,
  SimpleService4,
  SimpleService5,
  SimpleService6
} from "./simple.service";

@Component({
  selector: "service-providers",
  templateUrl: "service-providers.component.html"
})
export class ServiceProvidersComponent {
}

/**
 * The following component defines a dependency using a class type token.
 * See NgModule's providers property in service.providers.module.ts for
 * definition of the corresponding class provider.
 */
@Component({
  selector: "class-provider-with-class-type-token",
  template: `
  <h4 class="mt-2">Class provider with class type token</h4>
  <p class="border border-primary">
      The following illustrates using a class provider with a class type token. See
      ClassProviderWithClassTypeTokenComponent defined in service-providers.component.ts.<br><br>
      Text returned by the service is: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class ClassProviderWithClassTypeTokenComponent {
  constructor(public service: SimpleService1) {
  }
}

/**
 * The following component defines a dependency using a string token.
 * See NgModule's providers property in service.providers.module.ts for
 * definition of the corresponding class provider.
 */
@Component({
  selector: "class-provider-with-string-token",
  template: `
  <h4 class="mt-2">Class provider with string token</h4>
  <p class="border border-primary">
      The following illustrates using a class provider with a string token. See
      ClassProviderWithStringTokenComponent defined in service-providers.component.ts.<br><br>
      Text returned by the service is: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class ClassProviderWithStringTokenComponent {
  /**
   * When Angular encounters a constructor argument to which the Inject decorator
   * has been applied, it tries to match the token passed to the decorator with
   * a provider whose `provide` property matches the given token (in this
   * the string `aStringToken`).
   */
  constructor(@Inject("aStringToken") public service: SimpleService2) {
  }
}

/**
 * The following component defines a dependency using an opaque token.
 * See NgModule's providers property in service.providers.module.ts for
 * definition of the corresponding class provider.
 */
@Component({
  selector: "class-provider-with-opaque-token",
  template: `
  <h4 class="mt-2">Class provider an unique and opaque token</h4>
  <p class="border border-primary">
      The following illustrates using a class provider with an unique opaque token. See
      ClassProviderWithOpaqueTokenComponent defined in service-providers.component.ts.<br><br>
      Text returned by the service is: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class ClassProviderWithOpaqueTokenComponent {
  /**
   * When Angular encounters a constructor argument to which the Inject decorator
   * has been applied, it tries to match the token passed to the decorator with
   * a provider whose `provide` property matches the given token which in this
   * case is the SIMPLE_SERVICE_2 object (an opaque token).
   */
  constructor(@Inject(SIMPLE_SERVICE_2) public service: SimpleService2) {
  }
}

/**
 * The following component defines dependence on the SimpleService3 service.
 * However, due to the way corresponding service provider is defined in
 * service-providers.module.ts, the provider will allocated and pass in
 * an instance of the SimpleService1 service. The text printed by the
 * component's template confirms this.
 */
@Component({
  selector: "class-provider-replace-service-class-with-use-class-provider-property",
  template: `
  <h4 class="mt-2">Replacing service class using the useClass service provider property</h4>
  <p class="border border-primary">
      The following illustrates using the 'useClass' service provider property to allocate
      and pass in an instance of a different service than the one expected by the dependent
      component. The component expects SimpleService3 but the provider will pass in
      the SimpleService1 object. See ClassProviderReplaceServiceClassWithUseClassProviderPropertyComponent
      defined in service-providers.component.ts.<br><br>
      Text returned by the service is: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class ClassProviderReplaceServiceClassWithUseClassProviderPropertyComponent {
  constructor(public service: SimpleService3) {
  }
}

/**
 * The following component defines dependence on an array of services. Note that
 * constructor argument is decorated with the Inject decorator with a single
 * opaque token. NgModel's providers property in the service-providers.module.ts
 * contains several providers that use the same token, setting `useClass` property
 * to different services and `multi` property to true. This instructs Angular
 * to create an array of these services and pass it to the constructor with
 * the dependency identified by the given token.
 *
 * @note Even though constructor defines an array of SimpleService1 objects,
 * the provider will provide an array of three services
 * [SimpleService1, SimpleService2, SimpleService3]. This is not an issue
 * as the object signatures of all these simple services are the same.
 */
@Component({
  selector: "class-provider-resolving-dependency-with-array-of-services",
  template: `
  <h4 class="mt-2">Resolving a dependency with an array of services</h4>
  <p class="border border-primary">
      The following illustrates using the 'multi' service provider property to instruct
      Angular to create an array of services and pass that array to the component's
      constructor. See ClassProviderResolvingDependencyWithArrayOfServicesComponent
      defined in service-providers.component.ts.
  </p>
  <p *ngFor="let item of services;">
      Service text: <span class="font-weight-bold">{{ item.getServiceString() }}</span>
  </p>`
})
export class ClassProviderResolvingDependencyWithArrayOfServicesComponent {
  constructor(@Inject(SERVICE_ARRAY) public services: SimpleService1[]) {
  }
}

/**
 * A component whose dependency is resolved by a value provider. See the
 * corresponding provider in service-providers.module.ts.
 */
@Component({
  selector: "value-service-provider",
  template: `
  <h4 class="mt-2">Value service provider</h4>
  <p class="border border-primary">
      The following illustrates using the value providers to resolve the dependency.
      See ValueServiceProviderComponent defined in service-providers.component.ts.<br><br>
      Value injected to the component: <span class="font-weight-bold">{{ service }}</span>
  </p>`
})
export class ValueServiceProviderComponent {
  constructor(@Inject(VALUE_SERVICE) public service: any) {
  }
}

/**
 * A component whose dependency is resolved by a factory provider. See the
 * corresponding provider in service-providers.module.ts.
 */
@Component({
  selector: "factory-service-provider",
  template: `
  <h4 class="mt-2">Factory service provider</h4>
  <p class="border border-primary">
      The following illustrates using the factory providers to resolve the dependency.
      See FactoryProviderComponent defined in service-providers.component.ts.<br><br>
      Service text: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class FactoryProviderComponent {
  constructor(public service: SimpleService4) {
  }
}

/**
 * A component whose dependency is resolved by a factory provider that itself
 * defines dependencies on a service. See the corresponding provider in
 * service-providers.module.ts for illustration on how to defined such a
 * factory provider. Note that the service object actually passed to the
 * constructor is not SimpleService5, but a new object constructed by the
 * factory function.
 */
@Component({
  selector: "factory-service-provider-with-service-dependency",
  template: `
  <h4 class="mt-2">Factory service provider with service dependency</h4>
  <p class="border border-primary">
      The following illustrates using the factory providers that itself has a dependency
      to a service. See FactoryProviderComponentWithServiceDependency defined in
      service-providers.component.ts.<br><br>
      Service text: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class FactoryProviderComponentWithServiceDependency {
  constructor(public service: SimpleService5) {
  }
}

/**
 * A component whose service token is aliased to an existing token (in this
 * case the SimpleService5 class token). Because of this, the dependency
 * is resolved with the same object as the dependency for the existing
 * token. See corresponding service provider in service-providers.module.ts
 * for more details.
 */
@Component({
  selector: "aliasing-service-tokens",
  template: `
  <h4 class="mt-2">Aliasing service tokens</h4>
  <p class="border border-primary">
      The following illustrates aliasing service tokens using the 'useExisting'
      providers property. See AliasingServiceTokensComponent defined in
      service-providers.component.ts.<br><br>
      Service text: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
  </p>`
})
export class AliasingServiceTokensComponent {
  constructor(public service: SimpleService6) {
  }
}
