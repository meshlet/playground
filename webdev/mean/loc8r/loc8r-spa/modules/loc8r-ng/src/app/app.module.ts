import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { MiscModule } from './misc/misc.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    MainModule,
    MiscModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
