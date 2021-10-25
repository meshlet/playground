import {ErrorHandler, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import {RouterModule} from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from "./core/core.module";
import { RxjsAndAsyncHttpComponent } from "./rxjs-and-async-http.component";

@NgModule({
  imports: [
    CommonModule, NgbModule, CoreModule,
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
