import { Component } from '@angular/core';

/**
 * The main component of the user-facing part of the site.
 */
@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html'
})
export class MainComponent {
  public isMenuCollapsed = true;
}
