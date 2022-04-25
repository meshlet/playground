import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetOneLocationRspI } from 'loc8r-common/common.module';
import { LocationRepository } from '../dal/location.repository';
import { FrontendError } from '../misc/error';
import { ReporterService, ReporterData } from '../misc/reporter.service';

@Component({
  selector: 'app-location-details',
  templateUrl: 'location-details.component.html'
})
export class LocationDetailsComponent {
  public location?: GetOneLocationRspI['location'];
  constructor(private locationRepo: LocationRepository,
              private reporter: ReporterService,
              router: Router,
              activatedRoute: ActivatedRoute) {
    // Load location data from the server
    // @todo missing locationid param is a programming error (print debug msg and re-route?)
    if (typeof activatedRoute.snapshot.params.locationid === 'string') {
      this.locationRepo.getLocation(activatedRoute.snapshot.params.locationid)
        .subscribe(
          location => {
            this.location = location;
          },
          err => {
            if (err instanceof FrontendError) {
              this.reporter.sendMessage(new ReporterData(err.message, true));
            }
            else {
              this.reporter.sendMessage(new ReporterData(
                'Venue could not be obtained due to an error. Please refresh the page to try again.',
                true
              ));
            }

            // In case of error, navigate to the home page
            router.navigateByUrl('/locations')
              .catch(reason => {
                // @todo How to handle this?
                console.error(reason);
              });
          });
    }
  }
}
