import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetOneLocationRspI } from 'loc8r-common/common.module';
import { LocationRepository } from '../dal/location.repository';
import { FrontendError } from '../misc/error';
import { ReporterService, ReporterData } from '../misc/reporter.service';
import { PageHeader } from './page-header.component';
import { SideBar } from './page-sidebar.component';

/**
 * The details page component used to present the details of a single
 * location to the user. Note that this is only the host page keeping
 * everything together - the actual location details are handled by
 * the location-details.component.
 */
@Component({
  selector: 'app-details-page',
  templateUrl: 'details-page.component.html'
})
export class DetailsPageComponent {
  public location?: GetOneLocationRspI['location'];
  public pageHdr: PageHeader = { title: 'Selected venue is being loaded...' };
  public pageSidebar: SideBar = { mainText: '' };

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
            this.pageHdr.title = location.name;
            this.pageSidebar = {
              mainText: `${location.name} is on Loc8r because it has quality wifi and space to sit down with your laptop and get some work done.`,
              subText: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help people just like you.'
            };
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
