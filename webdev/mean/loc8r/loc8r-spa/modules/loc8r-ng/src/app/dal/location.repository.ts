import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetLocationsRspI,
  GetOneLocationRspI
} from 'loc8r-common/common.module';
import { DATA_SOURCE_INJECT_TOKEN, BaseDataSource } from './base.datasource';

/**
 * Location repository in charge of processing location data.
 *
 * @note While at the moment this class does nothing more than
 * pass data back/forth from/to data source, in case data needs
 * any additional processing this is where it will be handled
 * (e.g. filtering of locations based on some criteria).
 */
@Injectable()
export class LocationRepository {
  constructor(@Inject(DATA_SOURCE_INJECT_TOKEN) private dataSource: BaseDataSource) {}

  /**
   * Position coordinates are expected to be obtained from the gelocation
   * services or by other means (e.g. matching IP address to the approximate
   * location). Default max distance from the user's position is 3000 meters.
   */
  getLocations(longitude: number, latitude: number, maxDistance = 2000): Observable<GetLocationsRspI['locations']> {
    // return this.dataSource.getLocations(
    //   '10.380589298808665',
    //   '63.41638573651207',
    //   10000
    // );
    return this.dataSource.getLocations(
      longitude,
      latitude,
      maxDistance
    );
  }

  getLocation(locationid: string): Observable<GetOneLocationRspI['location']> {
    return this.dataSource.getOneLocation(locationid);
  }
}
