import { NgModule } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { RxjsAndAsyncHttpModule } from "./rxjs-and-async-http/rxjs-and-async-http.module";
import { RoutingAndNavigationModule } from "./routing-and-navigation/routing-and-navigation.module";
import { AdditionalSamplesModule } from "./additional-samples/additional-samples.module";

@NgModule({
  imports: [
    NgbModule,
    RxjsAndAsyncHttpModule,
    AdditionalSamplesModule,
    RoutingAndNavigationModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
