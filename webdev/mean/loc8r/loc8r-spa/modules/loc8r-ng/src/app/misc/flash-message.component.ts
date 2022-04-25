import {
  Component, ViewChild, ViewContainerRef, OnDestroy,
  ComponentFactory, ComponentFactoryResolver, Renderer2, AfterViewInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ReporterService } from './reporter.service';

/**
 * A component that renders flash messages sent through the ReporterService.
 */
@Component({
  selector: 'app-flash-message',
  templateUrl: 'flash-message.component.html'
})
export class FlashMessageComponent implements OnDestroy, AfterViewInit {
  private subscription?: Subscription;
  private alertFactory: ComponentFactory<NgbAlert>;

  constructor(private reporter: ReporterService,
              private renderer: Renderer2,
              private router: Router,
              resolver: ComponentFactoryResolver) {
    this.alertFactory = resolver.resolveComponentFactory(NgbAlert);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.container) {
        // Remove all alerts when navigating away to a new route
        this.container.clear();
      }
    });
  }

  /**
   * Container for instances of NgbAlert.
   */
  @ViewChild('container', { read: ViewContainerRef }) container?: ViewContainerRef;

  /**
   * Subscribe to the ReporterService.
   */
  ngAfterViewInit(): void {
    this.subscription = this.reporter.getObservable()
      .subscribe(
        data => {
          // This action is delayed because it is not allowed to make updates
          // that would result in data bindings returning different values, after
          // Angular has already run change detection and evaluated bindings
          // in the current cycle (subscribe callbacks are run as part of
          // content update, after re-evaluating data bindings).
          setTimeout(() => {
            if (this.container) {
              // Create new NgbAlert component instance and append it to the DOM
              const alert = this.container.createComponent<NgbAlert>(this.alertFactory);
              alert.instance.animation = true;
              alert.instance.dismissible = true;
              alert.instance.type = data.isError ? 'danger' : 'info';
              this.renderer.appendChild(alert.location.nativeElement, this.renderer.createText(data.message));

              // If alert is to be automatically closed, schedule a timeout
              let timeout: ReturnType<typeof setTimeout> | undefined;
              if (data.autoClose) {
                timeout = setTimeout(() => {
                  alert.instance.close();
                }, data.autoClose.timeoutMs);
              }

              // Listen to the alert's closed event to remove the HTML element from the DOM
              alert.instance.closed.subscribe(() => {
                if (this.container) {
                  const index = this.container.indexOf(alert.hostView);
                  if (index >= 0) {
                    this.container.remove(index);
                  }
                }

                // Destroy the alert
                alert.destroy();

                // Additionally, cancel auto-close timeout if one is in flight
                if (timeout) {
                  clearTimeout(timeout);
                }
              });
            }
          }, 0);
        },
        err => {
          // @todo This is unexpected and means that no more messages will come
          // through. Hence, component should subscribe to a new observable
          // returned by ReporterService.getObservable.
          console.log(err);
        });
  }

  /**
   * Unsubscribe from RenderService if component gets destroyed.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
