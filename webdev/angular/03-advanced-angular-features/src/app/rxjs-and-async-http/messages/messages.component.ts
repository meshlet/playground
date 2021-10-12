import { Component } from "@angular/core";
import { MessageService } from "./message.service";
import { MessageModel } from "./message.model";

@Component({
  selector: "message-reporter",
  templateUrl: "messages.component.html"
})
export class MessagesComponent {
  public lastMsg: MessageModel | undefined;

  constructor(private msgService: MessageService) {
    this.msgService.getObservable().subscribe((msg: MessageModel) => this.lastMsg = msg);
  }
}
