import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DATA_SOURCE_INJECT_TOKEN } from './base.datasource';
// import { StaticDataSource } from './static.datasource';
import { RestDataSource } from './rest.datasource';
import { LocationRepository } from './location.repository';
import { ReviewRepository } from './review.repository';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    { provide: DATA_SOURCE_INJECT_TOKEN, useClass: RestDataSource },
    LocationRepository, ReviewRepository
  ]
})
export class DataAccessLayerModule {}
