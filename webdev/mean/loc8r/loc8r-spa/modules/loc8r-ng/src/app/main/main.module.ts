import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { MainRoutingModule } from './main-routing.module';
import { SignInComponent } from './signin.component';
import { SignUpComponent } from './signup.component';

@NgModule({
  declarations: [
    HomePageComponent,
    PageHeaderComponent,
    PageSidebarComponent,
    DetailsPageComponent,
    LocationsListComponent,
    LocationDetailsComponent,
    AboutComponent,
    AddReviewComponent,
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MainRoutingModule,
    FormsModule,
    NgbModule,
    DataAccessLayerModule,
    MiscModule
  ],
  exports: [RouterModule]
})
export class MainModule {}
