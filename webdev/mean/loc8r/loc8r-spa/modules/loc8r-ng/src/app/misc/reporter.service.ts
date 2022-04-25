import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * Describes the message data for the ReporterService.
 *
 * Message reporter can configure whether alert closes automatically
 * after a specified timeout as well as whether message is an error
 * or an informational message.
 */
export class ReporterData {
  constructor(
    public message: string,
    public isError = false,
    public autoClose?: { timeoutMs: number }) {}
}

/**
 * A service used to communicate messages throught the application.
 *
 * @note ReplaySubject is used to avoid a situation where
 * some messages are missed at the very start of the application,
 * before components are fully initialized and view queries
 * are executed.
 */
@Injectable()
export class ReporterService {
  private subject = new ReplaySubject<ReporterData>(10, 2000);

  getObservable(): Observable<ReporterData> {
    return this.subject;
  }

  sendMessage(msg: ReporterData) {
    this.subject.next(msg);
  }
}
