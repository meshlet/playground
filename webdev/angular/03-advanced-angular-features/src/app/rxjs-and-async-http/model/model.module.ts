import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { StaticDataSourceModel } from "./static-data-source.model";
import { REST_URL, RestDataSourceModel } from "./rest-data-source.model";
import { RepositoryModel } from "./repository.model";
import { DATA_SOURCE } from "./data-source-interface.model";

@NgModule({
  imports: [HttpClientModule],
  providers: [
    RepositoryModel,
    { provide: REST_URL, useValue: `http://${location.hostname}:3500/products`},

    /**
     * To switch to the static data source replace RestDataSourceModel with
     * StaticDataSourceModel in the provider below.
     */
    { provide: DATA_SOURCE, useClass: RestDataSourceModel }
  ]
})
export class ModelModule {
}
