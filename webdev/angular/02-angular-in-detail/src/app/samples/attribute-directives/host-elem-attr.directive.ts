/**
 * A directive that accesses host element's attribute via a constructor
 * parameter
 */

import { Directive, ElementRef, Attribute } from "@angular/core";

@Directive({
  selector: "[appHostElemAttrDir]"
})
export class HostElemAttrDirective {
  /**
   * @note The Attribute parameter decorator indicates to Angular that constructor's
   * bgClass parameter will be set to the value of the host element's appHostElemAttrDir
   * attribute. Note that one doesn't have to use the attribute name which matches the
   * directive's selector name. This is done for convenience, so that directive and
   * attribute can be applied to the HTML element together like so:
   *
   * <div appHostElemAttrDir="bg-warning"></div>
   *
   * If attribute was defined with a different name e.g. @Attribute("appHostElemAttrDirBgClass")
   * one would have to use the directive like this:
   *
   * <div appHostElemAttrDir appHostElemAttrDirBgClass="bg-warning"></div>
   */
  constructor(hostElem: ElementRef, @Attribute("appHostElemAttrDirBgClass") bgClass: string) {
    (hostElem.nativeElement as HTMLElement).classList.add(bgClass || "bg-success", "text-white");
  }
}
