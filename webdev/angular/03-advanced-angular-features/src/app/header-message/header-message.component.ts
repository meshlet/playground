import { Component } from "@angular/core";
import {HeaderMessageEventDataType, HeaderMessageService} from "./header-message.service";

@Component({
  selector: "header-message",
  templateUrl: "header-message.component.html"
  //     `
  //     <div *ngIf="!waitingForUserInput; else elseBlock"
  //          class="bg-info text-white text-center py-2" [class.h3]="!isDataReady">
  //         {{ isDataReady ?
  //             "The number of performed navigations: " + completedNavigationsCount :
  //             "Loading data..." }}
  //     </div>
  //     <ng-template #elseBlock>
  //         <!-- Display the message and button option to the users. See more info in -->
  //         <!-- routing-and-navigation.component.ts and terms-guard.service.ts. -->
  //         <div class="bg-info text-white text-center py-2">
  //             <span class="d-block">{{ $any(userInputData).message }}</span>
  //             <button type="button" class="btn btn-warning px-2"
  //                     [class.mr-1]="i < $any(userInputData).responses.length - 1"
  //                     *ngFor="let response of $any(userInputData).responses; let i = index"
  //                     (click)="waitingForUserInput = false; response[1]()">
  //                 {{ response[0] }}
  //             </button>
  //         </div>
  //     </ng-template>
  // `
})
export class HeaderMessageComponent {
  public lastMsg: HeaderMessageEventDataType | null = null;

  constructor(headerMsgService: HeaderMessageService) {
    headerMsgService.getObservable()
      .subscribe((value: HeaderMessageEventDataType | null) => {
        this.lastMsg = value;
      });
  }
}
