import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  AngularUnitTestingComponent,
  InPlaceTemplateComponent,
  ServiceDepAndDataBindingComponent,
  ExtTmplHostListenerAndOutputPropComponent,
  InputPropComponent,
  AsyncOpsComponent
} from "./angular-unit-testing.component";
import {DATA_SOURCE, StaticDataSourceModel} from "./static-data-source.model";
import {RepositoryModel} from "./repository.model";
import { RestDataSourceModel} from "./rest-data-source.model";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "", component: AngularUnitTestingComponent }
    ])
  ],
  declarations: [
    AngularUnitTestingComponent,
    InPlaceTemplateComponent,
    ServiceDepAndDataBindingComponent,
    ExtTmplHostListenerAndOutputPropComponent,
    InputPropComponent,
    AsyncOpsComponent
  ],
  providers: [
    {
      provide: DATA_SOURCE, useClass: StaticDataSourceModel
    },
    RepositoryModel,
    RestDataSourceModel
  ]
})
export class AdditionalSamplesModule {
}
