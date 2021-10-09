import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MessageService } from "./message.service";
import { MessagesComponent } from "./messages.component";

@NgModule({
  imports: [BrowserModule],
  declarations: [MessagesComponent],
  exports: [MessagesComponent],
  providers: [MessageService]
})
export class MessagesModule {
}
