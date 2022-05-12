import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { DetailsPageComponent } from './details-page.component';
import { AboutComponent } from './about.component';

/**
 * Route definition for the main.module which is the root.
 */
const routes = RouterModule.forRoot([
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
  imports: [routes]
})
export class MainRoutingModule {}
