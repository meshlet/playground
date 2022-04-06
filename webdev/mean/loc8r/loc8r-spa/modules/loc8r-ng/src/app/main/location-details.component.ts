import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetOneLocationRspI } from 'loc8r-common/common.module';
import { LocationRepository } from '../dal/location.repository';

@Component({
  selector: 'app-location-details',
  templateUrl: 'location-details.component.html'
})
export class LocationDetailsComponent {
  public location?: GetOneLocationRspI['location'];
  constructor(private locationRepo: LocationRepository, activatedRoute: ActivatedRoute) {
    // Load location data from the server
    // @todo handle Observable error
    if (typeof activatedRoute.snapshot.params.locationid === 'string') {
      this.locationRepo.getLocation(activatedRoute.snapshot.params.locationid)
        .subscribe(observer => {
          this.location = observer;
        });
    }
  }
}
