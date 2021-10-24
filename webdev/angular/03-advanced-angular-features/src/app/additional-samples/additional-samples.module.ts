import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RxjsComponent } from "./rxjs/rxjs.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "", component: RxjsComponent }
    ])
  ],
  declarations: [
    RxjsComponent
  ],
  exports: [RxjsComponent]
})
export class AdditionalSamplesModule {
}
