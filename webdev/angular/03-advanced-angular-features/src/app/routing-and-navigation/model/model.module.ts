import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { REST_URL, RestDataSourceModel } from "./rest-data-source.model";
import { RepositoryModel } from "./repository.model";
import { DATA_SOURCE } from "./data-source-interface.model";
import { DataResolverService } from "./data-resolver.service";

@NgModule({
  imports: [HttpClientModule],
  providers: [
    RepositoryModel,
    { provide: REST_URL, useValue: `http://${location.hostname}:3500/products`},
    { provide: DATA_SOURCE, useClass: RestDataSourceModel },
    { provide: DataResolverService, useClass: DataResolverService }
  ]
})
export class ModelModule {
}
