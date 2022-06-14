import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  GetLocationsRspI,
  GetOneLocationRspI,
  GetOneReviewRspI,
  CreateReviewRspI,
  CreateUserRspI,
  LoginUserRspI,
  ReviewI,
  UserI,
  isValidRestResponse,
  SuccessRspTypeLiteralsT,
  SuccessRspTypeLiteralToType,
  RestErrorI,
  SuccessRspUnionT
} from 'loc8r-common/common.module';
import { BaseDataSource } from './base.datasource';
import { FrontendError, ErrorCode } from '../misc/error';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Sanity checks REST API response to make sure its format is as
 * expected and makes sure that response type matches the type
 * specified by the caller. If these two checks pass, delegates
 * processing of the success/failure response to the success/failure
 * callback.
 *
 * @note The overload is used to map `expectedSuccessRspType` literal
 * to a SuccessRspUnionT type, indicating the type of response passed
 * to the `handleSuccessRspCb` callback (if REST API response is a
 * successfull one).
 */
function processRestResponse<SuccessRspTypeLiteralT extends SuccessRspTypeLiteralsT>(
  restApiRes: HttpResponse<unknown>,
  expectedSuccessRspType: SuccessRspTypeLiteralT,
  handleSuccessRspCb: (restRspBody: SuccessRspTypeLiteralToType<SuccessRspTypeLiteralT>) => void,
  handleFailureRspCb: (error: RestErrorI) => void): void;
function processRestResponse(
  restApiRes: HttpResponse<unknown>,
  expectedSuccessRspType: SuccessRspTypeLiteralsT,
  handleSuccessRspCb: (restRspBody: SuccessRspUnionT) => void,
  handleFailureRspCb: (error: RestErrorI) => void) {
  if (!isValidRestResponse(restApiRes.body)) {
    // Unexpected response received from the REST server
    throw new FrontendError(ErrorCode.InternalServerError);
  }
  const json = restApiRes.body;
  if (json.success) {
    if (json.body.type !== expectedSuccessRspType) {
      // Unexpected response type received from the REST server
      throw new FrontendError(ErrorCode.InternalServerError);
    }
    handleSuccessRspCb(json.body);
  }
  else {
    handleFailureRspCb(json.error);
  }
}

/**
 * A REST-full data source that reads/writes the data from/to
 * the REST server.
 */
@Injectable()
export class RestDataSource implements BaseDataSource {
  constructor(private httpClient: HttpClient) {}

  getLocations(longitude: number, latitude: number, maxDistance: number): Observable<GetLocationsRspI['locations']> {
    return new Observable(subscriber => {
      this.httpClient.get<unknown>(
        `${environment.rest_api_base_url}/locations`,
        {
          observe: 'response',
          params: { longitude: longitude, latitude: latitude, maxDistance: maxDistance }
        })
        .subscribe(rsp => {
          try {
            processRestResponse(
              rsp,
              'GetLocations',
              (json: GetLocationsRspI) => {
                subscriber.next(json.locations);
                subscriber.complete();
              },
              (err: RestErrorI) => {
                if (rsp.status < 500) {
                  subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                }
                else {
                  subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                }
              });
          }
          catch (exception) {
            subscriber.error(exception);
          }
        },
        err => {
          // This can only fail due to a network error.
          console.log(err);
          subscriber.error(new FrontendError(ErrorCode.NetworkError));
        });
    });
  }

  getOneLocation(locationid: string): Observable<GetOneLocationRspI['location']> {
    return new Observable(subscriber => {
      this.httpClient.get<unknown>(
        `${environment.rest_api_base_url}/locations/${locationid}`,
        {
          observe: 'response'
        })
        .subscribe(rsp => {
          try {
            processRestResponse(
              rsp,
              'GetOneLocation',
              (json: GetOneLocationRspI) => {
                subscriber.next(json.location);
                subscriber.complete();
              },
              (err: RestErrorI) => {
                if (rsp.status < 500) {
                  subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                }
                else {
                  subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                }
              });
          }
          catch (exception) {
            subscriber.error(exception);
          }
        },
        err => {
          // This can only fail due to a network error.
          console.log(err);
          subscriber.error(new FrontendError(ErrorCode.NetworkError));
        });
    });
  }

  getOneReview(locationid: string, reviewid: string): Observable<GetOneReviewRspI['review']> {
    return new Observable(subscriber => {
      this.httpClient.get<unknown>(
        `${environment.rest_api_base_url}/locations/${locationid}/reviews/${reviewid}`,
        {
          observe: 'response'
        })
        .subscribe(rsp => {
          try {
            processRestResponse(
              rsp,
              'GetOneReview',
              (json: GetOneReviewRspI) => {
                subscriber.next(json.review);
                subscriber.complete();
              },
              (err: RestErrorI) => {
                if (rsp.status < 500) {
                  subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                }
                else {
                  subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                }
              });
          }
          catch (exception) {
            subscriber.error(exception);
          }
        },
        err => {
          // This can only fail due to a network error.
          console.log(err);
          subscriber.error(new FrontendError(ErrorCode.NetworkError));
        });
    });
  }

  createReview(locationid: string, review: ReviewI): Observable<CreateReviewRspI['review']> {
    return new Observable(subscriber => {
      this.httpClient.post(
        `${environment.rest_api_base_url}/locations/${locationid}/reviews`,
        review,
        {
          observe: 'response'
        })
        .subscribe(rsp => {
          try {
            processRestResponse(
              rsp,
              'CreateReview',
              (json: CreateReviewRspI) => {
                subscriber.next(json.review);
                subscriber.complete();
              },
              (err: RestErrorI) => {
                if (rsp.status === 401) {
                  subscriber.error(new FrontendError(ErrorCode.Unauthenticated, err.message));
                }
                else if (rsp.status === 404) {
                  subscriber.error(new FrontendError(ErrorCode.ResourceNotFound));
                }
                else if (rsp.status < 500) {
                  subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                }
                else {
                  subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                }
              });
          }
          catch (exception) {
            subscriber.error(exception);
          }
        },
        err => {
          // This can only fail due to a network error.
          console.log(err);
          subscriber.error(new FrontendError(ErrorCode.NetworkError));
        });
    });
  }

  createUser(user: UserI): Observable<CreateUserRspI['user']> {
    return new Observable(subscriber => {
      this.httpClient.post(
        `${environment.rest_api_base_url}/signup`,
        user,
        {
          observe: 'response'
        })
        .subscribe(rsp => {
          try {
            processRestResponse(
              rsp,
              'CreateUser',
              (json: CreateUserRspI) => {
                subscriber.next(json.user);
                subscriber.complete();
              },
              (err: RestErrorI) => {
                if (rsp.status === 403) {
                  subscriber.error(new FrontendError(ErrorCode.Forbidden, err.message));
                }
                else if (rsp.status < 500) {
                  subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                }
                else {
                  subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                }
              });
          }
          catch (exception) {
            subscriber.error(exception);
          }
        },
        err => {
          // This can only fail due to a network error.
          console.log(err);
          subscriber.error(new FrontendError(ErrorCode.NetworkError));
        });
    });
  }

  loginUser(user: UserI): Observable<{ user: LoginUserRspI['user'], jwt: LoginUserRspI['jwt']}> {
    return new Observable(subscriber => {
      this.httpClient.post(
        `${environment.rest_api_base_url}/login`,
        user,
        {
          observe: 'response'
        })
        .subscribe(rsp => {
          try {
            processRestResponse(
              rsp,
              'LoginUser',
              (json: LoginUserRspI) => {
                subscriber.next({ user: json.user, jwt: json.jwt });
                subscriber.complete();
              },
              (err: RestErrorI) => {
                if (rsp.status === 401) {
                  subscriber.error(new FrontendError(ErrorCode.Unauthenticated, err.message));
                }
                else if (rsp.status < 500) {
                  subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                }
                else {
                  subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                }
              });
          }
          catch (exception) {
            subscriber.error(exception);
          }
        },
        err => {
          // This can only fail due to a network error.
          console.log(err);
          subscriber.error(new FrontendError(ErrorCode.NetworkError));
        });
    });
  }
}
