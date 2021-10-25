import {Component} from "@angular/core";
import { HeaderMessageEventData, HeaderMessageService } from "./header-message.service";
import {ActivatedRoute} from "@angular/router";

/**
 * A component that displays the a latest message sent from anywhere
 * in the app on top of the page.
 */
@Component({
  selector: "header-message",
  templateUrl: "header-message.component.html"
})
export class HeaderMessageComponent {
  public lastMsg: HeaderMessageEventData | null = null;
  public previousMsg: HeaderMessageEventData | null = null;
  private previousTopLevelUrlSegment = "";

  constructor(private headerMsgService: HeaderMessageService, private route: ActivatedRoute) {
    headerMsgService.getObservable()
      .subscribe((value: HeaderMessageEventData | null) => {
        this.previousMsg = this.lastMsg;
        this.lastMsg = value;
      });
  }

  restorePreviousMsgIfRequired() {
    if (this.lastMsg !== null && this.lastMsg.restorePreviousMsgAfterUserAction) {
      this.lastMsg = this.previousMsg;
      this.previousMsg = null;
    }
  }
}
