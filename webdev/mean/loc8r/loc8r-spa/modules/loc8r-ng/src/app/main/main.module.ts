import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { LocationsListComponent } from './locations-list.component';
import { DataAccessLayerModule } from '../dal/dal.module';

@NgModule({
  declarations: [
    MainComponent,
    LocationsListComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgbModule,
    DataAccessLayerModule
  ],
  exports: [
    MainComponent,
    LocationsListComponent
  ]
})
export class MainModule {}
