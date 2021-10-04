import { Injectable } from "@angular/core";
import { MessageModel } from "./message.model";

type HandlerFunction = (msg: MessageModel) => void;

@Injectable()
export class MessageService {
  private handler: HandlerFunction | undefined;

  setHandlerFn(fn: HandlerFunction) {
    this.handler = fn;
  }

  reportMessage(msg: MessageModel) {
    if (this.handler) {
      this.handler(msg);
    }
  }
}
