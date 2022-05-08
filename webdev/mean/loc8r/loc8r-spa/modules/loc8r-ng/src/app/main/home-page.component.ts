import { Component } from '@angular/core';
import { PageHeader } from './page-header.component';
import { SideBar } from './page-sidebar.component';

/**
 * The component hosting the content of the homepage i.e.
 * everything between navigation bar and the footer.
 */
@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html'
})
export class HomePageComponent {
  public pageHeaderAndSidebar: { header: PageHeader, sideBar: SideBar } = {
    header: {
      title: 'Loc8r',
      tagline: 'Find places to work with WiFi near you!'
    },
    sideBar: {
      mainText: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.'
    }
  };
}
