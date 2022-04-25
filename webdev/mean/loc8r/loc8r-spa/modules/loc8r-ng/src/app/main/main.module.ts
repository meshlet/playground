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
import { FormsModule } from '@angular/forms';
import { AddReviewComponent } from './add-review.component';

/**
 * Routing for the main module which is the root.
 */
const routes = RouterModule.forRoot([
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'locations/:locationid/newreview',
        component: AddReviewComponent
      },
      {
        path: 'locations',
        component: LocationsListComponent
      },
      {
        path: 'locations/:locationid',
        component: LocationDetailsComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: '**', redirectTo: '/locations'
      }
    ]
  }
]);

@NgModule({
  declarations: [
    MainComponent,
    LocationsListComponent,
    LocationDetailsComponent,
    AboutComponent,
    AddReviewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    routes,
    NgbModule,
    DataAccessLayerModule,
    MiscModule
  ],
  exports: [
    RouterModule
  ]
})
export class MainModule {}
