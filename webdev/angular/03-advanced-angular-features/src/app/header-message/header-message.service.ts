import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export class HeaderMessageEventData {
  constructor(
    public message: string,
    public responses?: { answer: string, callbackFn: () => void }[],
    public restorePreviousMsgAfterUserAction?: boolean,
    public isError = false) {
  }
}

/**
 * A service that allows the rest of the application to send messages
 * to the component that will show them on top of the page.
 */
@Injectable()
export class HeaderMessageService {
  private msgSubject = new Subject<HeaderMessageEventData | null>();

  sendMsg(msg: HeaderMessageEventData | null) {
    this.msgSubject.next(msg);
  }

  getObservable(): Observable<HeaderMessageEventData | null> {
    return this.msgSubject;
  }
}
