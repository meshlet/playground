import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetLocationsRspI,
  GetOneLocationRspI,
  GetOneReviewRspI,
  CreateReviewRspI,
  ReviewI
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
  // ESLint falsly complains about a useless ctor
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(DATA_SOURCE_INJECT_TOKEN) private dataSource: BaseDataSource) {}

  getLocations(): Observable<GetLocationsRspI['locations']> {
    return this.dataSource.getLocations();
  }

  getLocation(locationid: string): Observable<GetOneLocationRspI['location']> {
    return this.dataSource.getOneLocation(locationid);
  }

  getReview(locationid: string, reviewid: string): Observable<GetOneReviewRspI['review']> {
    return this.dataSource.getOneReview(locationid, reviewid);
  }

  createReview(locationid: string, review: ReviewI): Observable<CreateReviewRspI['review']> {
    return this.dataSource.createReview(locationid, review);
  }
}
