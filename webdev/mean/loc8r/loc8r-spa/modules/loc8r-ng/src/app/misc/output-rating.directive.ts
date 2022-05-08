import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Structural directive that renders a location rating for
 * the given rating value (between 0 and 5).
 *
 * @note Directive user is responsible for setting the
 * host element's class to the value of the starCssClass
 * context variable provided by the directive.
 *
 * @todo Re-implement this as a component. It will most likely
 * be better contained (e.g. user won't have to set CSS class
 * themselves) that way.
 */
@Directive({
  selector: '[appRenderRating]'
})
export class OutputRatingDirective implements OnChanges {
  constructor(private container: ViewContainerRef,
              private template: TemplateRef<OutputRatingDirectiveContext>) {
  }

  /**
   * Used to pass in rating to the directive.
   */
  @Input('appRenderRating')
  rating = 0;

  ngOnChanges(changes: SimpleChanges): void {
    const ratingChange = changes.rating;
    if (ratingChange && typeof ratingChange.currentValue === 'number') {
      this.container.clear();
      const ratingInt = Math.floor(ratingChange.currentValue);
      let i = 0;
      while (i < 5) {
        let starCssClass = 'empty-star';
        if (i < ratingInt) {
          starCssClass = 'solid-star';
        }
        else if (i === ratingInt && this.rating - ratingInt > 0) {
          starCssClass = 'half-star';
        }

        this.container.createEmbeddedView(
          this.template,
          new OutputRatingDirectiveContext(starCssClass));

        ++i;
      }
    }
  }
}

class OutputRatingDirectiveContext {
  constructor(public $implicit: string) {}
}
