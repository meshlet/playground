import { Component } from "@angular/core";

/**
 * Used to illustrate named router-outlets. For route definition using named
 * outlets see lazy-loaded.module.ts and for HTML see lazy-loaded.component.html.
 */
@Component({
  selector: "first-component",
  template: `
    <div class="bg-primary p-2 text-white">
        This is the <span class="h3">first</span> component.
    </div>
  `
})
export class FirstComponent {
}
