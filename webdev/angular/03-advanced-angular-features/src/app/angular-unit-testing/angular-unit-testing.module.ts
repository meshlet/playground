import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularUnitTestingComponent } from "./angular-unit-testing.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "", component: AngularUnitTestingComponent }
    ])
  ],
  declarations: [
    AngularUnitTestingComponent
  ]
})
export class AdditionalSamplesModule {
}
