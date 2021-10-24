import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "./app.component";
import { HeaderMessageService } from "./header-message/header-message.service";
import { HeaderMessageComponent } from "./header-message/header-message.component";

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
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
  providers: [HeaderMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
