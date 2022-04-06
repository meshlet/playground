import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainModule } from './main/main.module';
import { MainComponent } from './main/main.component';
import { LocationsListComponent } from './main/locations-list.component';
import { LocationDetailsComponent } from './main/location-details.component';
import { AboutComponent } from './main/about.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
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
];

@NgModule({
  imports: [MainModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
