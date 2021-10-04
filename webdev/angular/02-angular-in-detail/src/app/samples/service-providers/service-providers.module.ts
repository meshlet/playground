import { NgModule } from '@angular/core';

import { ServiceProvidersComponent } from "./service-providers.component";
import {
  SimpleService1,
  SimpleService2,
  SimpleService3,
  SimpleService4,
  SimpleService5,
  SimpleService6,
  SIMPLE_SERVICE_2,
  SERVICE_ARRAY,
  VALUE_SERVICE
} from "./simple.service";

import {
  ClassProviderWithClassTypeTokenComponent,
  ClassProviderWithStringTokenComponent,
  ClassProviderWithOpaqueTokenComponent,
  ClassProviderReplaceServiceClassWithUseClassProviderPropertyComponent,
  ClassProviderResolvingDependencyWithArrayOfServicesComponent,
  ValueServiceProviderComponent,
  FactoryProviderComponent,
  FactoryProviderComponentWithServiceDependency,
  AliasingServiceTokensComponent
} from "./service-providers.component";

import {
  ContentChildComponent,
  ViewChildComponent,
  IllustrateComponentDecoratorProvidersPropertyComponent,
  IllustrateComponentDecoratorViewProvidersPropertyComponent,
  HostAndOptionalDecoratorsDirective,
  IllustrateHostAndOptionalDecoratorsComponent,
  IllustrateSkipSelfDecoratorComponent
} from "./local-providers.component";

@NgModule({
  declarations: [
    ServiceProvidersComponent,
    ClassProviderWithClassTypeTokenComponent,
    ClassProviderWithStringTokenComponent,
    ClassProviderWithOpaqueTokenComponent,
    ClassProviderReplaceServiceClassWithUseClassProviderPropertyComponent,
    ClassProviderResolvingDependencyWithArrayOfServicesComponent,
    ValueServiceProviderComponent,
    FactoryProviderComponent,
    FactoryProviderComponentWithServiceDependency,
    AliasingServiceTokensComponent,
    ContentChildComponent,
    ViewChildComponent,
    IllustrateComponentDecoratorProvidersPropertyComponent,
    IllustrateComponentDecoratorViewProvidersPropertyComponent,
    HostAndOptionalDecoratorsDirective,
    IllustrateHostAndOptionalDecoratorsComponent,
    IllustrateSkipSelfDecoratorComponent
  ],

  /**
   * The following illustrates different service providers supported by Angular.
   *
   * @note See components defined in service-providers.component.ts to see how
   * the service dependencies are defined in constructors.
   */
  providers: [
    /**
     * This is an example of a class provider using the literal syntax. See the
     * ClassProviderWithClassTypeTokenComponent component which will be matched
     * by this provider.
     *
     * The `provide` property is used to specify a token, which is used to identify
     * the provider and the dependency to be resolved. The token is set to the
     * service class type in this case, see other examples below for more
     * possibilities.
     *
     * The 'useClass' property specifies the class that will be instantiated to
     * satisfy the given dependency. This can be used to create service aliases
     * for example.
     *
     * @note When Angular encounters a component, directive, pipe or service whose
     * constructor has a parameter of SimpleService1 type (the token defines by
     * the `provide` property below), it will allocate the instance of the SimpleService1
     * class (as specified by the `useClass` property below).
     */
    { provide: SimpleService1, useClass: SimpleService1 },

    /**
     * The following uses a string as a token. Note that @Inject decorator must be used
     * if token is not a class type. See ClassProviderWithStringTokenComponent defined
     * in service-providers.component.ts for example of this.
     */
    { provide: "aStringToken", useClass: SimpleService2 },

    /**
     * The following illustrates using an opaque token which is an instance of the
     * InjectionToken class. See SERVICE_TOKEN_2 in simple.service.ts for how to
     * define these tokens and ClassProviderWithOpaqueTokenComponent in
     * service-providers.component.ts for how to use these tokens to define
     * dependencies.
     */
    { provide: SIMPLE_SERVICE_2, useClass: SimpleService2 },

    /**
     * The following illustrates using the `useClass` property to instruct Angular
     * to instantiate a class that is not the same class expected by classes that
     * define the dependency. This provider will match those dependencies where
     * the constructor expects the SimpleService3 class token, but the provider
     * will instead allocate SimpleService1. See
     * ClassProviderReplaceServiceClassWithUseClassProviderPropertyComponent for
     * a component that is matched by this provider.
     *
     * @note TypeScript won't report any errors because of this mismatch. This
     * is because dependency injection is a runtime feature, so TypeScript
     * compiler doesn't get to analyze the code and detect constructor parameter
     * and argument mismatch.
     *
     * @note This feature must be used with caution. Runtime errors might occur
     * if the allocated object have different properties/methods from the service
     * expected by the dependant classes (components, directives, pipes or
     * services). Because of that, it is best to limit this feature to allocating
     * instances of subclasses instead of the base class expected by the constructors
     * of dependant blocks. This makes sure that the object passed to the constructor
     * has all the properties/methods as the base class.
     */
    { provide: SimpleService3, useClass: SimpleService1 },

    /**
     * The following illustrates configuring multiple service providers using the
     * `multi = true` so that Angular will create an array containing these services
     * and pass that array to the dependent blocks. In order for this to work as
     * expected, each provider must have the same token and the `multi` property
     * must be set to true. See ClassProviderResolvingDependencyWithArrayOfServicesComponent
     * for the component that is matched by these providers.
     */
    { provide: SERVICE_ARRAY, useClass: SimpleService1, multi: true },
    { provide: SERVICE_ARRAY, useClass: SimpleService2, multi: true },
    { provide: SERVICE_ARRAY, useClass: SimpleService3, multi: true },

    /**
     * The following illustrates the value service providers. These providers use
     * the `useValue` property to specify the value that Angular will use to
     * resolve the dependency (that is, pass it to the constructor of the dependant
     * block). Compare this to the class providers where Angular will allocate a
     * new instance of the object when it needs to resolve a dependency (if instance
     * hasn't been allocated already). With value providers, Angular will always use
     * the same object or value to resolve the dependency. See ValueProviderComponent
     * for the component that is matched by this provider.
     */
    { provide: VALUE_SERVICE, useValue: 10000 },

    /**
     * The following illustrates using factory providers. Factory provider is a
     * function that Angular invokes to produce a service object, when one is
     * needed. This is opposed to class providers where Angular simply allocates
     * an object of the specified class. The SimpleService4 class is used as a
     * token and the factory provider function returns an object of SimpleService1
     * class. See FactoryProviderComponent for the component matched by this
     * provider.
     *
     * @note Angular will invoke the factory function only when it needs a new
     * service object. Just like with class providers, this is done only once
     * per module so that there will ever only be one instance of the given
     * service object shared by all dependants within the given module and its
     * child modules.
     */
    { provide: SimpleService4, useFactory: () => new SimpleService1() },

    /**
     * The following is a factory provider that itself defines a dependency on
     * a service using the `deps` property which is an array of dependencies
     * that will be resolved by Angular before invoking the factory function.
     * The resolved services are passed to the factory function as arguments.
     * The dependencies are resolved in exactly the same way they are resolved
     * when specified in constructors of components, directives, pipes or
     * services.
     *
     * SimpleService1 token gets resolved to the SimpleService1 object by the very
     * first provider in this providers array and the SIMPLE_SERVICE_2 gets resolved
     * to SimpleService2 by the third provider in this providers array.
     *
     * This factory provider matches the SimpleService5 class token. Component
     * matched by the provider is FactoryProviderComponentWithServiceDependency.
     */
    {
      provide: SimpleService5,
      deps: [SimpleService1, SIMPLE_SERVICE_2],
      useFactory: (service1: SimpleService1, service2: SimpleService2) => {
        class SimpleService {
          getServiceString(): string {
            return `(${service1.getServiceString()}, ${service2.getServiceString()})`;
          }
        }
        return new SimpleService();
      }
    },

    /**
     * The following illustrates using the `useExisting` provider's property to alias
     * SimpleService6 class token to the SimpleService5 token. After tokens are aliased,
     * any dependency identified by one or the other token will be resolved with the
     * same object, in this case object returned by the factory provider defined right
     * above this alias rule.
     */
    { provide: SimpleService6, useExisting: SimpleService5 }
  ],
  exports: [ServiceProvidersComponent]
})
export class ServiceProvidersModule {

}
