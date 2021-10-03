/**
 * Besides defining providers at NgModule level (as illustrated by service-providers.module.ts and
 * service-providers.component.ts), Angular supports defining them at component and directive level
 * as well (for directive-scope providers see local-providers.directive.ts). Let's assume that we
 * have the following components:
 *
 * - top-level-component
 * - content-child-component
 * - view-child-component
 *
 * (see attribute-directives/content-children.directive.ts for illustration of what is a content child,
 * and components-in-detail/product-table.component.ts for illustration of what is a view child).
 *
 * TODO: add local-providers.directive.ts that illustrates defining local service providers at directive
 *       level.
 *
 * Assume that top-level-component's content is as follows:
 *
 * <top-level-component>
 *   <content-child-component></content-child-component>
 * </top-level-component>
 *
 * while the top-level-component's template is as follows:
 *
 * <ng-content></ng-content>
 * <view-child-component></view-child-component>
 *
 * ----------------- @COMPONENT DECORATOR'S PROVIDERS PROPERTY -----------------
 *
 * Furthermore, assume that content-child-component depends on the Service1 and view-child-component
 * depends on the Service2 service, while top-level-component defines the following providers using
 * the @Component decorator's providers property as follows:
 *
 * @Component({
 *   providers: [
 *     { provide: Service1, useClass: Service1 }
 *     { provide: Service2, useClass: Service2 }
 *   ]
 * }
 *
 * The service providers defined in the @Component decorator's `providers` property will be used
 * to resolve dependencies in both content and view children. When Angular encounters the dependencies
 * in both content-child-component and view-child-component, it will first check whether these components
 * themselves define providers that can be used to resolve their dependencies. As none of these components
 * define any providers, Angular moves up the descendants tree and checks the top-level-component.
 * Angular realizes that this component defines two providers both of which can be used to resolve dependencies
 * in both content and view children. It uses the first provider (Service1) to resolve the dependency in
 * content-child-component (which is a content child of the top-level-component) and uses the second provider
 * (Service2) to resolve the dependency in the view-child-component (which is a view child of the
 * top-level-component).
 *
 * ----------------- @COMPONENT DECORATOR'S VIEW PROVIDERS PROPERTY -----------------
 *
 * Let's now assume that top-level-component defines service providers using the @Component decorator's
 * `viewProviders` property as follows:
 *
 * @Component({
 *   viewProviders: [
 *     { provide: Service1, useClass: Service1 }
 *     { provide: Service2, useClass: Service2 }
 *   ]
 * }
 *
 * The service providers defined within the `viewProviders` property are only used to resolve dependencies
 * in the view children, but not content children. In our example, Angular will again detect that both
 * content-child-component and view-child-component have dependencies to Service1 and Service2 respectively.
 * As none of these two components have defined any service providers, Angular moves to their parent (the
 * top-level-component). This component has defined providers via viewProviders property which means that
 * Angular can resolve the dependency of the view-child-component component with an instance of Service2
 * service. However, Angular cannot resolve the dependency of the content-child-component because the
 * viewProviders are not applied to content children. Angular would than proceed up the descendants chain
 * to try and find a component or a module that define a provider which can resolve the content-child-component's
 * dependency (the rest of the descendants are not shown here). If such provider is not found after the root
 * module is examined, Angular throws an error.
 *
 * @note Defining providers for the same services with both `providers` and `viewProviders` properties at the
 * same time is not supported. If this is done then both content and view children's dependencies to those
 * services are resolved with view providers.
 *
 * ----------------- @Host, @Optional and @SkipSelf decorators -----------------
 *
 * - @Host decorator: when applied to a dependency, this decorator tells Angular that it will limit
 *   the search for suitable providers to the nearest component. If the dependency is defined in a
 *   constructor of a component, @Host decorator will limit the provider search to the providers
 *   defined in that particular component. If the dependency is defined in a directive, then the
 *   provider search is limited to the parent component.
 *
 * - @Optional decorator: when applied to a dependency, it makes it optional so that Angular will
 *   not throw an error in case Angular fails to resolve the given dependency.
 *
 * - @SkipSelf decorator: when applied to a dependency in a component or directive, it instructs
 *   Angular to ignore that component's or directive's providers when resolving their own
 *   dependencies. Their providers are still consulted when resolving their children's dependencies,
 *   just not their own dependencies decorated with @SkipSelf.
 */

import {Component, Inject, Directive, Host, Optional, HostBinding, SkipSelf} from "@angular/core";
import {
  SimpleService1, SimpleService5, SIMPLE_SERVICE_2, SimpleService4, SimpleService2, SimpleService3, VALUE_SERVICE
} from "./simple.service";

/**
 * This component will be a content child of its parent component. It also defines
 * the dependency to SimpleService1.
 */
@Component({
  selector: "content-child-component",
  template: `
      <p class="border border-primary">
          Service text: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
      </p>`
})
export class ContentChildComponent {
  constructor(public service: SimpleService1) {}
}

/**
 * This component will be a view child of its parent component. It also defines
 * the dependency to SimpleService2.
 */
@Component({
  selector: "view-child-component",
  template: `
      <p class="border border-primary">
          Service text: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
      </p>`
})
export class ViewChildComponent {
  constructor(@Inject(SIMPLE_SERVICE_2) public service: SimpleService2) {}
}

/**
 * This component illustrates that service providers defined in the @Component decorator's
 * providers property resolve dependencies in both content and view children. For in-depth
 * explanation see the comment at the top of this source file.
 */
@Component({
  selector: "illustrate-component-decorator-providers-property",
  template: `
    <h4 class="mt-2">@Component decorator's providers property</h4>
    <p>
        The following illustrates that @Component decorator's <span class="font-weight-bold">providers</span>
        property resolves dependency both for content children (elements in the host element's content) and
        view children (elements in the component's template). See
        IllustrateComponentDecoratorProvidersPropertyComponent in local-providers.component.ts.
    </p>
    <p>
        The following component (ContentChildComponent) is a content child of its parent component.
        Even though the component's constructor defines dependency on the SimpleService1 service, the
        dependency is resolved with the SimpleService5 service by the
        IllustrateComponentDecoratorProvidersPropertyComponent component.
    </p>
    <ng-content></ng-content>
    <p>
        The following component (ViewChildComponent) is a view child of its parent component. Even
        though the component's constructor defines dependency on the SIMPLE_SERVICE_2 token, the
        dependency is resolved with the SimpleService4 service by the
        IllustrateComponentDecoratorProvidersPropertyComponent component. See
        local-providers.component.ts.
    </p>
    <view-child-component></view-child-component>
  `,
  providers: [
    { provide: SimpleService1, useClass: SimpleService5 },
    { provide: SIMPLE_SERVICE_2, useClass: SimpleService4 }
  ]
})
export class IllustrateComponentDecoratorProvidersPropertyComponent {
}

/**
 * This component illustrates that service providers defined in the @Component decorator's
 * viewProviders property resolve dependencies only in view children. For in-depth explanation
 * see the comment at the top of this source file.
 */
@Component({
  selector: "illustrate-component-decorator-viewProviders-property",
  template: `
      <h4 class="mt-2">@Component decorator's viewProviders property</h4>
      <p>
          The following illustrates that @Component decorator's <span class="font-weight-bold">viewProviders</span>
          property resolves only the dependencies for the view children (elements in the component's template), but
          not dependencies of the content children. See  IllustrateComponentDecoratorProvidersPropertyComponent
          in local-providers.component.ts.
      </p>
      <p>
          The following component (ContentChildComponent) is a content child of its parent component.
          The component's constructor defines dependency on the SimpleService1 service, while the parent
          IllustrateComponentDecoratorProvidersPropertyComponent component defines a view provider that
          resolves a dependency to SimpleService1 with an instance of SimpleService3 service. However,
          because viewProviders only resolve dependencies for view children, this provider won't get
          used for this content child. The dependency will be resolved by the provider defined at module
          level in service-providers.module.ts and will be resolved with an instance of the SimpleService1
          service.
      </p>
      <ng-content></ng-content>
      <p>
          The following component (ViewChildComponent) is a view child of its parent component. Even
          though the component's constructor defines dependency on the SIMPLE_SERVICE_2 token, the
          dependency is resolved with the SimpleService5 service by the view provider in the
          IllustrateComponentDecoratorProvidersPropertyComponent component. See
          local-providers.component.ts.
      </p>
      <view-child-component></view-child-component>`,
  viewProviders: [
    { provide: SimpleService1, useClass: SimpleService3 },
    { provide: SIMPLE_SERVICE_2, useClass: SimpleService5 }
  ]
})
export class IllustrateComponentDecoratorViewProvidersPropertyComponent {
}

/**
 * The following directive uses the @Host decorator to limit the search for the
 * service provider to the nearest component, as well as the @Optional
 * decorator to make the dependency option. For more info check the comment
 * at the top of this source file.
 */
@Directive({
  selector: "[host-and-optional-decorators-directive]"
})
export class HostAndOptionalDecoratorsDirective {
  constructor(@Inject(VALUE_SERVICE) @Host() @Optional() private service: string) {
    this.elementContent = "Service text: " + (!service ? "No service provided" : service);
  }

  @HostBinding("textContent")
  elementContent: string;
}

/**
 * Illustrates the @Host and @Optional decorators. More info in the comment at the top
 * of this source file.
 */
@Component({
  selector: "illustrate-host-and-optional-decorators",
  template: `
    <h4 class="mt-2">@Host and @Optional decorators</h4>
    <p>
        The following paragraph is IllustrateHostAndOptionalDecoratorsComponent component's content
        child. HostAndOptionalDecoratorsDirective directive is applied to it, however that directive's
        dependency will not be resolved by the view provider defined in the parent
        IllustrateHostAndOptionalDecoratorsComponent component (view providers don't apply for content
        children). As the directive's dependency (see HostAndOptionalDecoratorsDirective in
        local-providers.component.ts) is marked with @Host decorator, Angular will stop the provider
        search at the nearest component which is the IllustrateHostAndOptionalDecoratorsComponent
        component. As directive's dependency is decorated with the @Optional decorator, Angular will
        simply set the service instance to undefined and won't throw an error.
    </p>
    <ng-content></ng-content>
    <p>
        The following paragraph is IllustrateHostAndOptionalDecoratorsComponent component's view
        child. HostAndOptionalDecoratorsDirective directive is applied to it and that directive's
        dependency will be resolved by the view provider defined in the parent
        IllustrateHostAndOptionalDecoratorsComponent component.
    </p>
    <p class="border border-primary font-weight-bold" host-and-optional-decorators-directive></p>`,

  viewProviders: [
    { provide: VALUE_SERVICE, useValue: "INJECTED SERVICE TEXT" }
  ]
})
export class IllustrateHostAndOptionalDecoratorsComponent {
}

/**
 * Illustrates the @SkipSelf decorator. More info can be found in the comment at the top of this
 * source file.
 */
@Component({
  selector: "illustrate-skip-self-decorator",
  template: `
    <h4 class="mt-2">@SkipSelf decorator</h4>
    <p>
        By default, the providers defined by a component are used to resolve dependencies
        of that same component. @SkipSelf decorator can be used to change this behavior,
        so that Angular will start one level up the descendants chain and won't use the
        component's providers to resolve it's own dependencies. For instance, this
        component (see IllustrateSkipSelfDecoratorComponent in local-providers.component.ts)
        depends on SimpleService1 and the component itself defines a provider that could
        resolve that dependency with a SimpleService3 instance. However, because @SkipSelf
        decorator is applied to the dependency, Angular won't consult its own providers and
        will end up using the provider defined in the NgModule in service-providers.module.ts.
    </p>
    <p class="border border-primary">
        Service text: <span class="font-weight-bold">{{ service.getServiceString() }}</span>
    </p>
  `,
  providers: [
    { provide: SimpleService1, useClass: SimpleService3 }
  ]
})
export class IllustrateSkipSelfDecoratorComponent {
  constructor(@SkipSelf() public service: SimpleService1) {
  }
}
