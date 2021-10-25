import { Injectable } from "@angular/core";
import {ActivatedRoute, CanLoad, Route, UrlSegment} from "@angular/router";
import { Observer } from "rxjs";
import { HeaderMessageEventData, HeaderMessageService } from "../header-message/header-message.service";

/**
 * Implements the CanLoad interface which means that this is a guard intended
 * to be used with the `canLoad` Route configuration property which controls
 * whether Angular is allowed to load the module attached to the given route.
 * If the `canLoad` method in this class returns true or Promise / Observable
 * returned from it resolves with true, Angular will load the module. Otherwise,
 * Angular will ignore the route activation and won't load the module.
 */
@Injectable()
export class LoadGuardService implements CanLoad{
  // Once user agrees to load the module ones, remember their choice and don't ask
  // again
  private isLoaded = false;

  constructor(private headerMsgService: HeaderMessageService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> | boolean {
    return this.isLoaded || new Promise<boolean>(resolve => {
      const eventData = new HeaderMessageEventData(
        "Do you want to load the dynamic module?",
        [
          { answer: "Yes", callbackFn: () => {
            resolve(true);
            this.isLoaded = true;
          }},
          { answer: "No", callbackFn: () => {
            resolve(false);
          }}
        ],
        true);

      this.headerMsgService.sendMsg(eventData);
    });
  }
}
