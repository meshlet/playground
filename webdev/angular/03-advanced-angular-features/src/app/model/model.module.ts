import { NgModule } from "@angular/core";

import { StaticDataSourceModel } from "./static-data-source.model";
import { RepositoryModel } from "./repository.model";

@NgModule({
  providers: [
    StaticDataSourceModel, RepositoryModel
  ]
})
export class ModelModule {
}
