import { Injectable, ErrorHandler, NgZone } from "@angular/core";
import {HeaderMessageEventData, HeaderMessageService} from "./header-message/header-message.service";
import {ActivatedRoute} from "@angular/router";

/**
 * This class will be used as a global error handler in place of
 * the Angular's default ErrorHandler class. This is setup using
 * the provider in the messages.module.ts.
 *
 * @note The global handler catches and processes only those errors
 * that are not handled elsewhere. This includes failed Observables
 * whose error is not caught.
 */
@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private headerMsgService: HeaderMessageService,
              private ngZone: NgZone) {
  }

  /**
   * Invoked by Angular for any errors that were not handled elsewhere
   * in the application.
   *
   * @note While the HeaderMessageService.sendMessage will signal a new event
   * which will execute the subscribed callback in header-message.component.ts
   * and set the error message, this does not in itself trigger Angular
   * change detection which means that data binding expression in
   * header-messages.component.html won't be re-evaluated and the error message
   * won't be displayed in UI. We need to trigger the change detection
   * manually and this is what NgZone service let's us do with its `run`
   * method. This method will execute the provided callback and run the
   * change detection which will make sure the error message is displayed
   * by re-evaluating data binding expressions among other things.
   *
   */
  handleError(error: any): void {
    let msg = error instanceof Error ? error.message : error.toString();
    this.ngZone.run(() => this.headerMsgService.sendMsg(
      new HeaderMessageEventData(
        msg,
        undefined,
        false,
        true)
    ));
  }
}
