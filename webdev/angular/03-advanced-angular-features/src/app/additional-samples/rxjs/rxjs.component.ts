import { Component } from "@angular/core";
import {Observable, Subject} from "rxjs";
import {distinctUntilChanged, filter, map, skipWhile, takeWhile} from "rxjs/operators";

@Component({
  selector: "rxjs-samples",
  templateUrl: "rxjs.component.html"
})
export class RxjsComponent {
  /**
   * The following block of variables is used in samples that illustrate the
   * `filter` operator.
   */
  public filterSubject = new Subject<number>();
  public valueReceivedFromFilteredObservable: number | undefined;
  public valueReceivedFromUnfilteredObservable: number | undefined;

  /**
   * The following block of variables is used in samples that illustrate the
   * `map` operator.
   */
  public mapSubject = new Subject<string>();
  public valueReceivedFromMapObservable: number | undefined;

  /**
   * The following block of variables is used in samples that illustrate the
   * `distinctUntilChange` operator.
   */
  public distinctUntilChangedSubject1 = new Subject<string>();
  public distinctUntilChangedSubject2 = new Subject<string>();
  public enteredValue1 = "";
  public eventCounter1 = 0;
  public enteredValue2 = '{ \"id\": 1, \"name\": \"Mickey Mouse\" }';
  public eventCounter2 = 0;

  /**
   * The following block of variables is used in samples that illustrate the
   * `skipWhile` operator.
   */
  public skipWhileSubject = new Subject<string>();
  public valueReceivedFromSkipWhileObservable = "";
  public skipWhileCheckboxChecked = false;

  /**
   * The following block of variables is used in samples that illustrate the
   * `takeWhile` operator.
   */
  public takeWhileSubject = new Subject<string>();
  public valueReceivedFromTakeWhileObservable = "";
  public takeWhileCheckboxChecked = false;

  constructor() {
    /**
     * As the name suggests, the filter operator filters out the events received
     * by an Observable. The callback registered with the `subscribe` method is
     * called only for those events for which `filter` method returns true. All
     * the other events are ignored. In this case, only events whose data value
     * is a number divisible with 10 are forwarded to the registered event handler.
     *
     * @note The `pipe` method is used to apply the operator to the Observable and
     * return a new Observable whose events will be manipulated by the provided
     * operator (in this case the filter operator).
     *
     * @note The pipe method does not modify the Observable on which it is called.
     * That means that applied operators affect only the Observable instance returned
     * by the pipe method and not the original Observable. Hence, if we were to subscribe
     * again to the same Observable below but without the filter operator, this newly
     * registered callback would be invoked for each event (that is, the filter registered
     * below won't affect the new subscriber),
     */
    this.filterSubject
      .pipe(filter((value: number) => {
        return value % 10 === 0;
      }))
      .subscribe((value: number) => {
        this.valueReceivedFromFilteredObservable = value;
    });
    // Subscribe another handler to the Observable but don't filter out any events. As explained
    // above, this handler will be invoked for every event Observable receives.
    this.filterSubject
      .subscribe((value: number) => {
        this.valueReceivedFromUnfilteredObservable = value;
      });

    /**
     * The `map` operator transforms the event object of each event received by an
     * Observable. The new event object returned by the callback passed to the `map`
     * operator takes place of the original event object passed to that callback.
     * For the example below, the original event object is a string while the new
     * event object is its length which is then passed to the subscribed event
     * handled (callback passed to the `subscribe` method).
     *
     * @note The example below illustrates that map operator is free to produce
     * event object whose type doesn't match the type of the original event object.
     * In this example, the original event object is a string and the event object
     * produced by map operator is a number.
     *
     * @note The callback passed to the map operator MUST NOT modify the event object
     * passed to it. This is because the same event object is passed to all subscribers
     * in turn, so if event object is modified by a map callback of one subscriber all
     * the subscribers that receive the event object afterwards will actually receive
     * the modified event object. Map callback must always instantiate and return a
     * new instance.
     */
    this.mapSubject
      .pipe(map((value: string) => {
        // Return the length of the string as the new event object which is then passed on to
        // the subscribed callback.
        return value.length;
      }))
      .subscribe((value: number) => {
        this.valueReceivedFromMapObservable = value;
      });

    /**
     * The `distinctUntilChanged` operator filters out those events whose event object
     * is the same as that of the previously signalled event. For example, if event
     * objects are numbers and two events are signalled back to back with the value
     * of 10, only the first event will be passed on to the subscribed callback and
     * the second one will be discarded. If then a third event arrives also carrying
     * the value of 10, it is discarded two. Then an event with a value of 20 arrives
     * and is forwarded to the subscribed callback because its value is different
     * from the previous event's value 10.
     *
     * @note See next example for using distinctUntilChanged operator with non-primitive
     * Javascript values (i.e. objects).
     */
    this.distinctUntilChangedSubject1
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        // Increment the event counter
        ++this.eventCounter1;
      });

    /**
     * The distinctUntilChanged operator uses the Object.is method to compare values, meaning
     * any two distinct object instances (unlike primitive types such as number or string)
     * will be considered different, event though they might represent the same data. To
     * work around this, operator accepts a custom comparator that can be used to compare
     * values instead of the default Object.is() based comparison. The example below compares
     * objects by their ID properties, assuming that to objects are equal if their IDs match.
     *
     * @note The callback passed to the `distinctUntilChanged` operator is supplied with two
     * arguments. The first one is the event object of the last event that was forwarded to
     * subscribed callbacks (not discarded) and the second argument is the event object of
     * the event that is currently processed. The callback passed to distinctUntilChanged
     * is not called for the very first event.
     */
    this.distinctUntilChangedSubject2
      .pipe(distinctUntilChanged((x: any, y: any) => {
        try {
          if (typeof x === "string" && typeof y === "string") {
            // Try parsing objects from strings
            const xObj = JSON.parse(x);
            const yObj = JSON.parse(y);

            if (xObj.hasOwnProperty("id") && yObj.hasOwnProperty("id")) {
              // Compare the IDs
              return Object.is(xObj.id, yObj.id);
            }
          }
        }
        catch (e) {
        }
        // If we reach here, fallback to the default
        return Object.is(x, y);
      }))
      .subscribe((value: any) => {
        ++this.eventCounter2;
      });

    /**
     * The `skipWhile` RxJS operator can be used to discard all events while a certain
     * condition holds. Once the condition becomes false, the operator will forward all
     * the events to the next operator or the subscribed callbacks from that point on
     * regardless of the state of the condition. That is, after skipWhile starts
     * forwarding the events it will never stop doing so.
     */
    this.skipWhileSubject
      .pipe(skipWhile(() => !this.skipWhileCheckboxChecked))
      .subscribe((value: string) => {
        this.valueReceivedFromSkipWhileObservable = value;
      });

    /**
     * Similar to skipWhile, the takeWhile operator will forward all the events as longs as
     * a condition holds. Once condition becomes false, takeWhile will discard all events and
     * will continue to do so forever regardless of the changes in the condition state.
     */
    this.takeWhileSubject
      .pipe(takeWhile(() => !this.takeWhileCheckboxChecked))
      .subscribe((value: string) => {
        this.valueReceivedFromTakeWhileObservable = value;
      });
  }
}
