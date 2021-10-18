import { Component } from "@angular/core";
@Component({
  selector: "not-found",
  /**
   * Check the routes in routing-and-navigation.routing.ts to see how / URL gets redirected
   * to /table.
   */
  template: `
      <h3 class="bg-danger text-white p-2">The requested page couldn't be found</h3>
      <button class="btn btn-primary" routerLink="/">Start Over</button>
  `
})
export class NotFoundComponent {
}
