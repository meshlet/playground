import {Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ProductFormComponent } from "./product-form.component";
import { Observable, Subject } from "rxjs";
import { RepositoryModel } from "../model/repository.model";
import { ProductModel } from "../model/product.model";
import { HeaderMessageEventData, HeaderMessageService } from "../../header-message/header-message.service";

@Injectable()
export class UnsavedChangesGuardService implements CanDeactivate<ProductFormComponent> {
  constructor(private repository: RepositoryModel, private headerMsgService: HeaderMessageService) {
  }

  /**
   * Similar to the `CanActivate` guard (see terms-guard.service.ts), `CanDeactivate`
   * guard prevents Angular from navigating from a given route if guard service's
   * canDeactivate method returns false or returns a Promise / Observable that
   * resolves in false. This particular guard is used to prevent user form leaving
   * the product form component used to create new or edit existing product, if
   * they have already edited some form fields (leaving the page would cause them
   * to lose their changes).
   *
   * @note Unlike Resolve route guard used to delay route activation, canActivate
   * and canDeactivate guards don't require the Observable returned from their
   * methods to complete before Angular will complete the route transition. The navigation
   * completes as long as Angular receives a true value through the Observable,
   * without waiting for the Observable to be completed. This is why the Subjects
   * below don't call the complete method. This is also why replacing Subject with
   * a "new BehaviorSubject(false)" doesn't work, as Angular will get the false
   * value as soon as it subscribes and will reject the route transition.
   */
  canDeactivate(component: ProductFormComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
    if (currentRoute.url.length > 1 && currentRoute.url[0].path === "form") {
      let originalProduct = component.isEditing ?
        this.repository.getProduct(component.newProduct.id as number) :
        new ProductModel();

      if (originalProduct && !ProductModel.compare(originalProduct, component.newProduct)) {
        // User is attempting to navigate away from the product create/edit
        // page after modifying some of the form fields. Ask whether they
        // really want to do this before allowing Angular to proceed with
        // the route change.
        const subject = new Subject<boolean>();
        const eventData = new HeaderMessageEventData(
          "Unsaved changes will be lost. Are you sure you want to leave this page?",
          [
            { answer: "Leave", callbackFn: () => {
              subject.next(true);
            }},
            { answer: "Stay", callbackFn: () => {
              subject.next(false);
            }}
          ],
          true);

        this.headerMsgService.sendMsg(eventData);
        return subject;
      }
    }
    return true;
  }
}
