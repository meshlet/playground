/**
 * The admin feature module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent
  },
  {
    path: 'main', component: AdminComponent
  },
  {
    path: '**', redirectTo: 'auth'
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [AuthComponent, AdminComponent]
})
export class AdminModule {
}
