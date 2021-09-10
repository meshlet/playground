import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
  ContentChildrenListenForContentChangesOuterDir
} from "./samples/attribute-directives/content-children.directive";
import { ComponentsInDetailComponent } from "./samples/components-in-detail/components-in-detail.component";
import { ProductTableComponent, SetTextColorInnerDirective } from "./samples/components-in-detail/product-table.component";
import { ProductFormComponent } from "./samples/components-in-detail/product-form.component";
import { ToggleContentComponent } from "./samples/components-in-detail/toggle-content.component";

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
    ContentChildrenListenForContentChangesOuterDir,
    ComponentsInDetailComponent,
    ProductTableComponent,
    SetTextColorInnerDirective,
    ProductFormComponent,
    ToggleContentComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
