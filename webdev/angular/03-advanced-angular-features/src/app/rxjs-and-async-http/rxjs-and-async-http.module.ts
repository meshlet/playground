import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {RouterModule} from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from "./core/core.module";
import { MessagesModule } from "./messages/messages.module";
import { RxjsAndAsyncHttpComponent } from "./rxjs-and-async-http.component";

@NgModule({
  imports: [
    CommonModule, NgbModule, CoreModule, MessagesModule,
    RouterModule.forChild([
      {
        path: "", component: RxjsAndAsyncHttpComponent
      }
    ])
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
