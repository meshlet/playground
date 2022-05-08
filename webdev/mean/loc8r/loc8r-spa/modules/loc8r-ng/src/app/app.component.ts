import { Component } from '@angular/core';

/**
 * The root component containing the navigation menu as well
 * as the router-outlet where remaining content is attached
 * and the site's footer.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public isMenuCollapsed = true;
}
