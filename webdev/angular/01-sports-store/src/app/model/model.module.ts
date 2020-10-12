/**
 * An angular feature module for the data model functionality.
 */
import { NgModule } from '@angular/core';
import { ProductRepository } from './product.repository';
import { StaticDatasource } from './static.datasource';
import { Cart } from './cart.model';

@NgModule({
  providers: [ProductRepository, StaticDatasource, Cart]
})
export class ModelModule {}
