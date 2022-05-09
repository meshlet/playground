import { Component, Input } from '@angular/core';
import { GetOneLocationRspI, ReviewI } from 'loc8r-common/common.module';
import { environment } from '../../environments/environment';

/**
 * Renders a single location.
 */
@Component({
  selector: 'app-location-details',
  templateUrl: 'location-details.component.html'
})
export class LocationDetailsComponent {
  // @todo Implement the Required property decorator as explained in
  // https://stackoverflow.com/questions/35528395/make-directive-input-required
  // that would be applied to any input property whose value must be
  // provided. After that, declare input property with public location!: because
  // we know that non-null value must be passed in (otherwise a runtime error
  // is thrown).
  @Input('location')
  public location?: GetOneLocationRspI['location'];

  getGoogleMapsKey() {
    return environment.google_maps_api_key;
  }

  compareReviewsByDate(review1: ReviewI, review2: ReviewI): number {
    if (review1.createdOn === review2.createdOn) {
      return 0;
    }

    const date1 = new Date(review1.createdOn);
    const date2 = new Date(review2.createdOn);

    // More recent reviews 'come-before' (are considered lower-than) the older ones.
    return date1 > date2 ? -1 : 1;
  }
}
