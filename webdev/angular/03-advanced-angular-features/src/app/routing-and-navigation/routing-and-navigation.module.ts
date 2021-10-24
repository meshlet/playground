import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from "./core/core.module";
import { RoutingAndNavigationComponent } from "./routing-and-navigation.component";
import { TermsGuardService } from "./terms-guard.service";
import { Subject } from "rxjs";
import { LoadGuardService } from "./load-guard.service";
import { routingAndNavigationRouting } from "./routing-and-navigation.routing";

@NgModule({
  imports: [
    CommonModule, NgbModule, CoreModule, routingAndNavigationRouting
  ],
  declarations: [RoutingAndNavigationComponent],
  providers: [
    TermsGuardService,
    LoadGuardService
  ],
  exports: [RoutingAndNavigationComponent]
})
export class RoutingAndNavigationModule {
}
