import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { DataBindingsComponent } from "./samples/data-bindings.component";
import { BuiltinDirectivesComponent } from "./samples/builtin-directives.component";
import { Events2wayDataBindingsComponent } from "./samples/events-2way-data-bindings.component";
import { TemplateBasedFormsComponent } from "./samples/forms/template-based-forms.component";
import { ReactiveFormsComponent } from "./samples/forms/reactive-forms.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DataBindingsComponent,
    BuiltinDirectivesComponent,
    Events2wayDataBindingsComponent,
    TemplateBasedFormsComponent,
    ReactiveFormsComponent
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
