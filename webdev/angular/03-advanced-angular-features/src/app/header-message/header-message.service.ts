import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export type HeaderMessageEventDataType = {
  message: string,
  responses?: { answer: string, callbackFn: () => void }[]
};

/**
 * A service that allows the rest of the application to send messages
 * to the component that will show them on top of the page.
 */
@Injectable()
export class HeaderMessageService {
  private msgSubject = new Subject<HeaderMessageEventDataType | null>();

  sendMsg(msg: HeaderMessageEventDataType | null) {
    this.msgSubject.next(msg);
  }

  getObservable(): Observable<HeaderMessageEventDataType | null> {
    return this.msgSubject;
  }
}
