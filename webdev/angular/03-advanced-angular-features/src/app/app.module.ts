import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from "./main-project/core/core.module";
import { MessagesModule } from "./main-project/messages/messages.module";
import { AppComponent } from "./app.component";
import { MainProjectComponent } from "./main-project/main-project.component";
import { RxjsComponent } from "./additional-samples/rxjs/rxjs.component";

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    CoreModule,
    MessagesModule
  ],
  declarations: [AppComponent, MainProjectComponent, RxjsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
