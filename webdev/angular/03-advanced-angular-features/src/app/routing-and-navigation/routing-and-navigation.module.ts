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
import {LoadGuardService} from "./load-guard.service";

@NgModule({
  imports: [
    BrowserModule, NgbModule, CoreModule, routing
  ],
  declarations: [RoutingAndNavigationComponent],
  providers: [
    TermsGuardService,
    /**
     * A service provider used to provide a Subject instance used to facilitate
     * communication between the TermsGuardService (defined in terms-guard.service.ts)
     * and RoutingAndNavigationComponent (defined in routing-and-navigation.component.ts).
     */
    { provide: TERMS_GUARD_SUBJECT, useValue: new Subject<TermsGuardsCallbackParamType>() },
    LoadGuardService
  ],
  exports: [RoutingAndNavigationComponent]
})
export class RoutingAndNavigationModule {
}
