import { Component } from '@angular/core';
import { PageHeader } from './page-header.component';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent {
  public pageHdr: PageHeader = {
    title: 'About Loc8r'
  };
}
