/**
 * The admin feature module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent
  },
  {
    path: 'main', component: AdminComponent, canActivate: [AuthGuard]
  },
  {
    path: '**', redirectTo: 'main'
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [AuthGuard],
  declarations: [AuthComponent, AdminComponent]
})
export class AdminModule {
}
