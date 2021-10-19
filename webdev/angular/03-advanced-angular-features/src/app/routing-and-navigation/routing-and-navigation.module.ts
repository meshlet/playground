import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from "./core/core.module";
import { RoutingAndNavigationComponent } from "./routing-and-navigation.component";
import {
  TERMS_GUARD_SUBJECT, TermsGuardsCallbackParamType, TermsGuardService
} from "./terms-guard.service";

import { routing } from "./routing-and-navigation.routing";
import { Subject } from "rxjs";

@NgModule({
  imports: [
    BrowserModule, NgbModule, CoreModule, routing
  ],
  declarations: [RoutingAndNavigationComponent],
  providers: [
    TermsGuardService,
    { provide: TERMS_GUARD_SUBJECT, useValue: new Subject<TermsGuardsCallbackParamType>() }
  ],
  exports: [RoutingAndNavigationComponent]
})
export class RoutingAndNavigationModule {
}
