import { Component, Input } from '@angular/core';

export class SideBar {
  constructor(public mainText: string, public subText?: string) {}
}

/**
 * The component that captures UI and functionality
 * of the page sidebar.
 */
@Component({
  selector: 'app-page-sidebar',
  templateUrl: 'page-sidebar.component.html'
})
export class PageSidebarComponent {
  @Input()
  sidebar?: SideBar;
}
