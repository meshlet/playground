import { Injectable } from "@angular/core";
import { MessageModel } from "./message.model";
import { Observable, Subject } from "rxjs";

@Injectable()
export class MessageService {
  private subject = new Subject<MessageModel>();

  reportMessage(msg: MessageModel) {
    this.subject.next(msg);
  }

  getObservable(): Observable<MessageModel> {
    return this.subject;
  }
}
