import { Component } from '@angular/core';
import { LocationRepository } from '../dal/location.repository';
import { GetLocationsRspI } from 'loc8r-common/common.module';
import { ReporterData, ReporterService } from '../misc/reporter.service';
import { FrontendError } from '../misc/error';

@Component({
  selector: 'app-locations-list',
  templateUrl: 'locations-list.component.html'
})
export class LocationsListComponent {
  public locations: GetLocationsRspI['locations'] = [];
  constructor(private locationRepo: LocationRepository, private reporter: ReporterService) {
    // Load locations from the server
    this.locationRepo.getLocations()
      .subscribe(
        res => {
          this.locations = res;
        },
        err => {
          if (err instanceof FrontendError) {
            this.reporter.sendMessage(new ReporterData(err.message, true));
          }
          else {
            this.reporter.sendMessage(new ReporterData(
              'Venues could not be obtained due to an error. Please refresh the page to try again.',
              true
            ));
          }
        });
  }
}
