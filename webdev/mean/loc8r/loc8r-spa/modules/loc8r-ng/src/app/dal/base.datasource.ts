import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import {
  GetLocationsRspI,
  GetOneLocationRspI,
  GetOneReviewRspI,
  CreateReviewRspI,
  CreateUserRspI,
  LoginUserRspI,
  ReviewI,
  UserI
} from 'loc8r-common/common.module';

/**
 * Defines common interface implemented by data sources.
 */
export interface BaseDataSource {
  getLocations(longitude: number, latitude: number, maxDistance: number): Observable<GetLocationsRspI['locations']>;
  getOneLocation(locationid: string): Observable<GetOneLocationRspI['location']>;
  getOneReview(locationid: string, reviewid: string): Observable<GetOneReviewRspI['review']>;
  createReview(locationid: string, review: ReviewI): Observable<CreateReviewRspI['review']>;
  createUser(user: UserI): Observable<CreateUserRspI['user']>;
  loginUser(user: UserI): Observable<{ user: LoginUserRspI['user'], jwt: LoginUserRspI['jwt']}>;
}

/**
 * Injection token to be used to identify data source services.
 */
export const DATA_SOURCE_INJECT_TOKEN = new InjectionToken<BaseDataSource>('data source token');
