/**
 * Implements the network connectivity service used by the rest of the
 * application to discover whether the app is online or offline.
 */
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class ConnectivityService {
  private connEvents: Subject<boolean>;

  constructor() {
    this.connEvents = new Subject<boolean>();
    window.addEventListener('online', e => {
      this.connEvents.next(true);
    });
    window.addEventListener('offline', e => {
      this.connEvents.next(false);
    });
  }

  isConnected(): boolean {
    return window.navigator.onLine;
  }

  getObservable(): Observable<boolean> {
    return this.connEvents;
  }
}
