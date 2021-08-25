/**
 * Illustrates using the Directive.exportAs property to make the directive
 * available to the template for the purpose of binding it to a template
 * reference variable and accessing its properties.
 */

import { Directive } from "@angular/core";

@Directive({
  selector: "[appExportDir]",
  exportAs: "appExportDir"
})
export class ExportDirective {
  aStringProp: string = "";
}
