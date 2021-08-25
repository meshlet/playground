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
    ExportDirective
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
