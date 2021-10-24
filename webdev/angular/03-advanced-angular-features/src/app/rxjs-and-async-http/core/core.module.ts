import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import {ModeTrackerModel, MODE_TRACKER_TOKEN, MODE} from "./mode-tracker.model";
import { ProductTableComponent } from "./product-table.component";
import { ProductFormComponent } from "./product-form.component";
import { ModelModule } from "../model/model.module";
import { ModeFormatPipe } from "./mode-format.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "../messages/message.service";
import { RepositoryModel } from "../model/repository.model";
import {MessageModel} from "../messages/message.model";

@NgModule({
  imports: [CommonModule, FormsModule, ModelModule, NgbModule],
  declarations: [ProductFormComponent, ProductTableComponent, ModeFormatPipe],
  providers: [
    /**
     * ProductTableComponent (see product-table.component.ts) defines dependency on a
     * Observer<ModeTrackerModel> service and ProductFormComponent (see product-form.component.ts)
     * defines dependency on a Observable<ModeTrackerModel> service. The idea here is that
     * ProductTableComponent will signal a change using the Observer<ModeTrackerModel> service
     * which will cause the Observable<ModeTrackerModel> in ProductFormComponent to execute
     * the registered callback.
     *
     * However, in order for this to work, ProductTableComponent and ProductFormComponent must
     * receive the same service instance and that's where RxJS's Subject class comes into play.
     * Subject class implements both Observer and Observable interfaces, meaning one can pass
     * its instance both to classes which expect an Observer and classes which expect an
     * Observable.
     *
     * The provider below will resolve the dependency on the MODE_TRACKER_TOKEN (used by both
     * ProductTableComponent and ProductFormComponent) with an instance of Subject<ModeTrackerModel>
     * class, so that both of the components (as well as any other components, directives, pipes
     * or services that might depend on MODE_TRACKER_TOKEN in the future) will share the same
     * service instance. Hence, signalling events at one end (in the ProductTableComponent) will
     * result in the event callback being executed at other end (the callback registered by the
     * ProductFormComponent).
     *
     * @note Factory provider is used here because the goal is to create a Subject instance and
     * immediately subscribe to it. Additionally, this provider depends on the MessageService and
     * RepositoryModel both of which will be resolved and passed to the factory function. What
     * happens is that whenever user initiates a `Create New Product` or `Edit Product` action
     * in the ProductTableComponent (see core/product-table.component.ts), the callback registered
     * here will be invoked which will in turn report a new message to the MessageService instance.
     * Finally, the new message is reported to the MessagesComponent (see messages.component.ts)
     * that subscribed to the to MessageService observable.
     */
    {
      provide: MODE_TRACKER_TOKEN,
      deps: [MessageService, RepositoryModel],
      useFactory: (msgService: MessageService, repository: RepositoryModel) => {
        // Create a new Subject instance
        const subject = new Subject<ModeTrackerModel>();

        // We want to be notified when there's a change in the action user wants to perform
        // (editing existing or creating a new product), so subscribe to the Observable
        subject.subscribe((modeTracker: ModeTrackerModel) => {
          // There's been a change so report a new message to the MessageService. This will
          // result in a new event fired by the `reportMessage` method, which will lead to
          // the execution of the callback registered by the MessagesComponent (which will
          // finally show the message on top of the page).
          msgService.reportMessage(new MessageModel(
            `${MODE[modeTracker.mode]} ${(modeTracker.id ? repository.getProduct(modeTracker.id)?.name || "" : "")}`
          ));
        });
        return subject;
      }
    }
  ],
  exports: [ProductTableComponent, ProductFormComponent, ModelModule]
})
export class CoreModule {
}
