import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from "./core/core.module";
import { RoutingAndNavigationComponent } from "./routing-and-navigation.component";
import { routing } from "./routing-and-navigation.routing";

@NgModule({
  imports: [
    BrowserModule, NgbModule, CoreModule, routing
  ],
  declarations: [RoutingAndNavigationComponent],
  exports: [RoutingAndNavigationComponent]
})
export class RoutingAndNavigationModule {
}
