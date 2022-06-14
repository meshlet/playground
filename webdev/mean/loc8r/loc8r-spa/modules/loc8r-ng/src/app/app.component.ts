import { Component } from '@angular/core';
import { AuthService } from './misc/auth.service';

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

  constructor(public authService: AuthService) {}

  getCurrentUser(): string {
    const currUser = this.authService.getCurrentUser();
    return this.authService.isAuthenticated() && currUser
      ? `${currUser.firstname}`
      : '';
  }
}
