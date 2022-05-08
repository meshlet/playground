import { Component } from '@angular/core';
import { LocationRepository } from '../dal/location.repository';
import { GetLocationsRspI } from 'loc8r-common/common.module';
import { ReporterData, ReporterService } from '../misc/reporter.service';
import { FrontendError } from '../misc/error';
import { GeolocationService } from '../misc/geolocation.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: 'locations-list.component.html'
})
export class LocationsListComponent {
  public locations: GetLocationsRspI['locations'] = [];

  constructor(private locationRepo: LocationRepository,
              private reporter: ReporterService,
              private geolocation: GeolocationService) {
    // Try reading user's position
    this.geolocation.getLocation()
      .subscribe(position => {
        // Load nearby locations from the server using user's position as a
        // center.
        this.readLocations(position.coords.latitude, position.coords.longitude, 5000);
      },
      err => {
        // User's location couldn't be read using the Geolocation API
        // TODO: use IP address to approximate user's location.
        if (err instanceof FrontendError) {
          this.reporter.sendMessage(new ReporterData(err.message));
        }
        else {
          this.reporter.sendMessage(new ReporterData(
            'We were unable to read your position. Please refresh the page and grant access to your position if prompted.'));
        }
        // Load locations from the server using a fixed point as a center
        // TODO: use position aproximated from the IP address instead
        this.readLocations(63.41638573651207, 10.380589298808665, 10000);
      });
  }

  /**
   * A helper that attempts to read locations from the server.
   */
  readLocations(latitude: number, longitude: number, maxDistance = 2000) {
    this.locationRepo.getLocations(longitude, latitude, maxDistance)
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
