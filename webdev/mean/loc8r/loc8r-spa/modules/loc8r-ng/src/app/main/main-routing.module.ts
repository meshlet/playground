import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { DetailsPageComponent } from './details-page.component';
import { AboutComponent } from './about.component';
import { SignInComponent } from './signin.component';
import { SignUpComponent } from './signup.component';

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
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
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
