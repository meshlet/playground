import { NgModule } from '@angular/core';
import { DATA_SOURCE_INJECT_TOKEN } from './base.datasource';
import { StaticDataSource } from './static.datasource';
import { LocationRepository } from './location.repository';

@NgModule({
  providers: [
    { provide: DATA_SOURCE_INJECT_TOKEN, useClass: StaticDataSource },
    LocationRepository
  ]
})
export class DataAccessLayerModule {}
