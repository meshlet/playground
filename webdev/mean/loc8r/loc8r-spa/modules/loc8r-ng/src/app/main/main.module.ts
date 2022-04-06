import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { LocationsListComponent } from './locations-list.component';
import { DataAccessLayerModule } from '../dal/dal.module';
import { MiscModule } from '../misc/misc.module';
import { LocationDetailsComponent } from './location-details.component';
import { AboutComponent } from './about.component';

@NgModule({
  declarations: [
    MainComponent,
    LocationsListComponent,
    LocationDetailsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgbModule,
    DataAccessLayerModule,
    MiscModule
  ],
  exports: [
    MainComponent,
    LocationsListComponent,
    LocationDetailsComponent,
    AboutComponent
  ]
})
export class MainModule {}
