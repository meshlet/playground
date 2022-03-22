import { Component } from '@angular/core';
import { StaticDataSource } from '../data-access/static.datasource';

/**
 * The main component of the user-facing part of the site.
 */
@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html'
})
export class MainComponent {
  public isMenuCollapsed = true;

  constructor(private dataSource: StaticDataSource) {
    console.log(this.dataSource.getData());
  }
}
