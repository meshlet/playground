import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from "./core/core.module";
import { MessagesModule } from "./messages/messages.module";
import { RxjsAndAsyncHttpComponent } from "./rxjs-and-async-http.component";

@NgModule({
  imports: [
    BrowserModule, NgbModule, CoreModule, MessagesModule
  ],
  declarations: [
    RxjsAndAsyncHttpComponent
  ],
  exports: [
    RxjsAndAsyncHttpComponent
  ]
})
export class RxjsAndAsyncHttpModule {
}
