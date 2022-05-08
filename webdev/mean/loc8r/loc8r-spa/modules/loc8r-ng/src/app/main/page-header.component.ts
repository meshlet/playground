import { Component, Input } from '@angular/core';

export class PageHeader {
  constructor(public title: string, public tagline?: string) {}
}

/**
 * The component that captures the UI and functionality
 * of the page header.
 */
@Component({
  selector: 'app-page-header',
  templateUrl: 'page-header.component.html'
})
export class PageHeaderComponent {
  @Input()
  public header?: PageHeader;
}
