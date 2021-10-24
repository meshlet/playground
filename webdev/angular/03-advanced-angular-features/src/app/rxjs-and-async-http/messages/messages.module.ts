import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageService } from "./message.service";
import { MessagesComponent } from "./messages.component";
import { GlobalErrorHandlerService } from "./global-error-handler.service";

@NgModule({
  imports: [CommonModule],
  declarations: [MessagesComponent],
  exports: [MessagesComponent],
  providers: [
    MessageService,

    // Replace the Angular's default global error handler with the custom
    // one.
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ]
})
export class MessagesModule {
}
