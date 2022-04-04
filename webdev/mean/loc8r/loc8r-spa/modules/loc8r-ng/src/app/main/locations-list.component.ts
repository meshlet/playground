import { Component } from '@angular/core';
import { LocationRepository } from '../dal/location.repository';
import { GetLocationsRspI } from 'loc8r-common/common.module';

@Component({
  selector: 'app-locations-list',
  templateUrl: 'locations-list.component.html'
})
export class LocationsListComponent {
  public locations: GetLocationsRspI['locations'] = [];
  constructor(private locationRepo: LocationRepository) {
    // Load locations from the server
    // @todo Observable error needs to be handled
    this.locationRepo.getLocations()
      .subscribe(observer => {
        this.locations = observer;
      });
  }
}
