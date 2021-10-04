import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from "./core/core.module";
import { MessagesModule } from "./messages/messages.module";
import { ProductFormComponent } from "./core/product-form.component";
import { ProductTableComponent } from "./core/product-table.component";
import { MessagesComponent } from "./messages/messages.component";

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    CoreModule,
    MessagesModule
  ],
  bootstrap: [MessagesComponent, ProductFormComponent, ProductTableComponent]
})
export class AppModule { }
