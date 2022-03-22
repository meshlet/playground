import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { DataAccessModule } from '../data-access/data-access.module';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgbModule,
    DataAccessModule
  ],
  exports: [
    MainComponent
  ]
})
export class MainModule {}
