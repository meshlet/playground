/**
 * An angular feature module for the data model functionality.
 */
import { NgModule } from '@angular/core';
import { ProductRepository } from './product.repository';
import { StaticDatasource } from './static.datasource';
import { Cart } from './cart.model';
import { Order } from './order.model';
import { OrderRepository } from './order.repository';
import { RestDatasource } from './rest.datasource';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ConnectivityService } from './connectivity.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    ProductRepository, StaticDatasource, Cart, Order, OrderRepository,
    { provide: StaticDatasource, useClass: RestDatasource },
    RestDatasource, AuthService, ConnectivityService
  ]
})
export class ModelModule {}
