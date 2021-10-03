import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceProvidersModule } from "./samples/service-providers/service-providers.module";

import { AppComponent } from './app.component';
import { DataBindingsComponent } from "./samples/data-bindings.component";
import { BuiltinDirectivesComponent } from "./samples/builtin-directives.component";
import { Events2wayDataBindingsComponent } from "./samples/events-2way-data-bindings.component";
import { TemplateBasedFormsComponent } from "./samples/forms/template-based-forms.component";
import { ReactiveFormsComponent } from "./samples/forms/reactive-forms.component";
import { AttributeDirectivesComponent } from "./samples/attribute-directives/attribute-directives.component";
import { SimpleAtrDirective } from "./samples/attribute-directives/simple-atr.directive";
import { HostElemAttrDirective } from "./samples/attribute-directives/host-elem-attr.directive";
import { InputPropsDirective } from "./samples/attribute-directives/input-props.directive";
import { OutputPropsDirective } from "./samples/attribute-directives/output-props.directive";
import { HostBindingListenerDirective } from "./samples/attribute-directives/host-binding-listener.directive";
import { TwoWayBindingDirective } from "./samples/attribute-directives/two-way-binding.directive";
import { SimplifiedTwoWayBindingDirective } from "./samples/attribute-directives/two-way-binding-simplified.directive";
import { ExportDirective } from "./samples/attribute-directives/export.directive";
import { StructuralDirectivesComponent } from "./samples/structural-directives/structural-directives.component";
import { IfDirective } from "./samples/structural-directives/if.directive";
import { ForDirective } from "./samples/structural-directives/for.directive";

import {
  ContentChildInnerDirective,
  ContentChildSearchByDirClassOuterDir,
  ContentChildSearchByTmplVarNameOuterDir
} from "./samples/attribute-directives/content-child.directive";

import {
  ContentChildrenInnerDirective,
  ContentChildrenIncludeDescendentsOuterDir,
  ContentChildrenListenForContentChangesOuterDir,
  ContentChildrenSearchScopeComponent
} from "./samples/attribute-directives/content-children.directive";

import { ComponentsInDetailComponent } from "./samples/components-in-detail/components-in-detail.component";
import { ProductTableComponent, SetTextColorInnerDirective } from "./samples/components-in-detail/product-table.component";
import { ProductFormComponent } from "./samples/components-in-detail/product-form.component";
import { ToggleContentComponent } from "./samples/components-in-detail/toggle-content.component";
import { PipesComponent } from "./samples/pipes/pipes.component";
import { AddTaxPipe } from "./samples/pipes/add-tax.pipe";
import { CategoryFilterPipe } from "./samples/pipes/category-filter.pipe";
import { ServicesDepInjectionComponent } from "./samples/services-dep-injection/services-dep-injection.component";
import { DiscountDisplaySharingObjectsViaInputPropsComponent } from "./samples/services-dep-injection/discount-display.component";
import { DiscountEditorSharingObjectsViaInputPropsComponent } from "./samples/services-dep-injection/discount-editor.component";
import { DiscountDisplaySharingObjectsViaDepInjectionComponent } from "./samples/services-dep-injection/discount-display.component";
import { DiscountEditorSharingObjectsViaDepInjectionComponent } from "./samples/services-dep-injection/discount-editor.component";
import { DiscountService } from "./samples/services-dep-injection/discount.service";
import { DiscountPipe } from "./samples/services-dep-injection/discount.pipe";
import { DiscountAmountDirective } from "./samples/services-dep-injection/discount-amount.directive";
import { SimpleService } from "./samples/services-dep-injection/simple.service";
import localeEnGB from "@angular/common/locales/en-GB";
import localeFr from "@angular/common/locales/fr";
import localeFrCA from "@angular/common/locales/fr-CA";
import localeBs from "@angular/common/locales/bs";
import localeDe from "@angular/common/locales/de";
import { registerLocaleData } from "@angular/common";

// Register locales data
registerLocaleData(localeEnGB);
registerLocaleData(localeFr);
registerLocaleData(localeFrCA);
registerLocaleData(localeBs);
registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    DataBindingsComponent,
    BuiltinDirectivesComponent,
    Events2wayDataBindingsComponent,
    TemplateBasedFormsComponent,
    ReactiveFormsComponent,
    AttributeDirectivesComponent,
    SimpleAtrDirective,
    HostElemAttrDirective,
    InputPropsDirective,
    OutputPropsDirective,
    HostBindingListenerDirective,
    TwoWayBindingDirective,
    SimplifiedTwoWayBindingDirective,
    ExportDirective,
    StructuralDirectivesComponent,
    IfDirective,
    ForDirective,
    ContentChildInnerDirective,
    ContentChildSearchByDirClassOuterDir,
    ContentChildSearchByTmplVarNameOuterDir,
    ContentChildrenInnerDirective,
    ContentChildrenIncludeDescendentsOuterDir,
    ContentChildrenSearchScopeComponent,
    ContentChildrenListenForContentChangesOuterDir,
    ComponentsInDetailComponent,
    ProductTableComponent,
    SetTextColorInnerDirective,
    ProductFormComponent,
    ToggleContentComponent,
    PipesComponent,
    AddTaxPipe,
    CategoryFilterPipe,
    ServicesDepInjectionComponent,
    DiscountDisplaySharingObjectsViaInputPropsComponent,
    DiscountEditorSharingObjectsViaInputPropsComponent,
    DiscountDisplaySharingObjectsViaDepInjectionComponent,
    DiscountEditorSharingObjectsViaDepInjectionComponent,
    DiscountPipe,
    DiscountAmountDirective
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceProvidersModule
  ],
  /**
   * Angular examines  the providers array when it encounters a component, directive
   * or pipe whose constructor has parameters. Angular examines the types of those
   * parameters and attempts to find the corresponding classes in the NgModule's providers
   * array. If search is successful, Angular will allocate the given service(s) if they
   * haven't been allocated before and pass them to the constructor. This is all part of
   * Angular's dependency injection.
   */
  providers: [
    DiscountService,
    SimpleService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
