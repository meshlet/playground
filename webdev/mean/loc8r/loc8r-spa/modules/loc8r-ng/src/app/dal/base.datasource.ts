import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import {
  GetLocationsRspI,
  GetOneLocationRspI,
  GetOneReviewRspI,
  CreateReviewRspI,
  ReviewI
} from 'loc8r-common/common.module';

/**
 * Defines common interface implemented by data sources.
 */
export interface BaseDataSource {
  getLocations(longitude: string, latitude: string, maxDistance: number): Observable<GetLocationsRspI['locations']>;
  getOneLocation(locationid: string): Observable<GetOneLocationRspI['location']>;
  getOneReview(locationid: string, reviewid: string): Observable<GetOneReviewRspI['review']>;
  createReview(locationid: string, review: ReviewI): Observable<CreateReviewRspI['review']>;
}

/**
 * Injection token to be used to identify data source services.
 */
export const DATA_SOURCE_INJECT_TOKEN = new InjectionToken<BaseDataSource>('data source token');
