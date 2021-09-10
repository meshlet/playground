/**
 * This component illustrates content-projection using the ng-content element.
 * Content projection makes it possible to include host element's content
 * (if there is any) into the component's template. Assume that the `toggle-content`
 * HTML element is written as follows:
 *
 * <toggle-content>
 *   <div>
 *     This is a div.
 *   </div>
 * </toggle-content>
 *
 * then the ToggleContentComponent's template can include the content of the host
 * toggle-content element using ng-content:
 *
 * <p>
 *   Some text.
 * </p>
 * <ng-content></ng-content>
 *
 * When Angular encounters the ng-content element it will replace it with content
 * of the components host element (toggle-content), if it has any. Hence, the generated
 * page would be:
 *
 * <p>
 *   Some text.
 * </p>
 * <div>
 *   This is a div.
 * </div>
 */
import { Component } from "@angular/core";

@Component({
  selector: "toggle-content",
  templateUrl: "toggle-content.component.html"
})
export class ToggleContentComponent {
  public showContent = false;
}
