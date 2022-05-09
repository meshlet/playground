import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { LocationsListComponent } from './locations-list.component';
import { DataAccessLayerModule } from '../dal/dal.module';
import { MiscModule } from '../misc/misc.module';
import { DetailsPageComponent } from './details-page.component';
import { LocationDetailsComponent } from './location-details.component';
import { AboutComponent } from './about.component';
import { FormsModule } from '@angular/forms';
import { AddReviewComponent } from './add-review.component';
import { PageHeaderComponent } from './page-header.component';
import { PageSidebarComponent } from './page-sidebar.component';

/**
 * Routing for the main module which is the root.
 */
const routes = RouterModule.forRoot([
  // {
  //   path: 'locations/:locationid/newreview',
  //   component: AddReviewComponent
  // },
  {
    path: 'locations',
    component: HomePageComponent
  },
  {
    path: 'locations/:locationid',
    component: DetailsPageComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '**', redirectTo: '/locations'
  }
]);

@NgModule({
  declarations: [
    HomePageComponent,
    PageHeaderComponent,
    PageSidebarComponent,
    DetailsPageComponent,
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
