import {ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { HeaderMessageService } from "./header-message/header-message.service";
import { HeaderMessageComponent } from "./header-message/header-message.component";
import { GlobalErrorHandlerService } from "./global-error-handler.service";

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: "animation-samples",
        loadChildren: () => import("./animation/animation.module").then(mod => mod.AnimationModule)
      },
      {
        path: "routing-samples",
        loadChildren: () => import("./routing-and-navigation/routing-and-navigation.module")
          .then(mod => mod.RoutingAndNavigationModule)
      },
      {
        path: "rxjs-async-http-samples",
        loadChildren: () => import("./rxjs-and-async-http/rxjs-and-async-http.module")
          .then(mod => mod.RxjsAndAsyncHttpModule)
      },
      {
        path: "additional-samples",
        loadChildren: () => import("./additional-samples/additional-samples.module")
          .then(mod => mod.AdditionalSamplesModule)
      },
      {
        path: "",
        redirectTo: "routing-samples",
        pathMatch: "full"
      }
    ])
  ],
  declarations: [
    AppComponent, HeaderMessageComponent
  ],
  providers: [
    HeaderMessageService,
    /**
     * @note Overriding the global ErrorHandler service with a custom one can
     * only be done in a module that is not lazily loaded. Angular will ignore
     * the provided custom error handler if it is defined in a provider within
     * the lazily loaded module.
     */
    {
      provide: ErrorHandler, useClass: GlobalErrorHandlerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
