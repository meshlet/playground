import { NgModule } from '@angular/core';
import { StaticDataSource } from './static.datasource';

@NgModule({
  providers: [
    StaticDataSource
  ]
})
export class DataAccessModule {}
