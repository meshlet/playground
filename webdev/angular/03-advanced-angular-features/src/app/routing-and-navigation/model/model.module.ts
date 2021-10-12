import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { StaticDataSourceModel } from "./static-data-source.model";
import { RepositoryModel } from "./repository.model";
import { DATA_SOURCE } from "./data-source-interface.model";

@NgModule({
  imports: [HttpClientModule],
  providers: [
    RepositoryModel,
    { provide: DATA_SOURCE, useClass: StaticDataSourceModel }
  ]
})
export class ModelModule {
}
