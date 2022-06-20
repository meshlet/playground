import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
 * Makes sure that HTTP response body corresponds to a successfull
 * REST server response and that reponse type matches the type
 * specified by the caller. If these two checks pass, delegates
 * processing of the response to the callback.
 *
 * @note This function can only be used with successfull REST
 * responses. For processing REST server errors see
 * processRestRspError function.
 *
 * @note The overload is used to map `expectedSuccessRspType` literal
 * to a SuccessRspUnionT type, indicating the type of response passed
 * to the `handleSuccessRspCb` callback.
 */
function processRestRspSuccess<SuccessRspTypeLiteralT extends SuccessRspTypeLiteralsT>(
  restApiRes: HttpResponse<unknown>,
  expectedSuccessRspType: SuccessRspTypeLiteralT,
  handleSuccessRspCb: (restRspBody: SuccessRspTypeLiteralToType<SuccessRspTypeLiteralT>) => void): void;
function processRestRspSuccess(
  restApiRes: HttpResponse<unknown>,
  expectedSuccessRspType: SuccessRspTypeLiteralsT,
  handleSuccessRspCb: (restRspBody: SuccessRspUnionT) => void) {
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
    // REST server should never send an error response with < 400 HTTP status
    // (HttpClient resolves with HttpResponse only for requests completed with
    // non-error status codes i.e. < 400. Otherwise, HttpErrorResponse is
    // generated).
    throw new FrontendError(ErrorCode.InternalServerError);
  }
}

/**
 * Process HTTP failure response.
 *
 * This function makes sure that response is of HttpErrorResponse type.
 * Furthermore, if response body (i.e. rsp.error) is a valid REST server
 * response, it makes sure that it is a failure and not a successfull
 * REST response. If both these conditions are true a callback with
 * both original failure response and type-checked response body is
 * called. If response body is not a well-formed REST response, a
 * NetworkError is reported as this can only happen if HttpClient
 * couldn't reach the REST server.
 *
 * @note This function can only be used with failure HTTP responses.
 * For processing successfull responses see processRestRspSuccess.
 */
function processRestRspError(rsp: unknown,
                             errCb: (err: RestErrorI, errRsp: HttpErrorResponse) => void) {
  if (rsp instanceof HttpErrorResponse) {
    if (!isValidRestResponse(rsp.error)) {
      // This should happen only if HttpClient wasn't able to connect to
      // the REST API in which case HttpErrorResponse.error would not have
      // been set by the REST server.
      throw new FrontendError(ErrorCode.NetworkError);
    }

    const json = rsp.error;
    if (json.success) {
      // REST server should never send a success response with >= 400 HTTP status
      // (HttpClient resolves with HttpErrorResponse only for requests completed with
      // error status codes i.e. >= 400. Otherwise, HttpResponse is generated).
      throw new FrontendError(ErrorCode.InternalServerError);
    }

    // Invoke callback with the REST API error
    errCb(json.error, rsp);
  }
  else {
    // Something has gone quite wrong if HttpClient reports an error
    // whose type is not HttpErrorResponse
    throw new FrontendError(ErrorCode.InternalServerError);
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
        .subscribe(
          rsp => {
            try {
              processRestRspSuccess(
                rsp,
                'GetLocations',
                (json: GetLocationsRspI) => {
                  subscriber.next(json.locations);
                  subscriber.complete();
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
          },
          errRsp => {
            try {
              processRestRspError(
                errRsp,
                (err, httpErrRsp) => {
                  if (httpErrRsp.status < 500) {
                    subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                  }
                  else {
                    subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                  }
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
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
        .subscribe(
          rsp => {
            try {
              processRestRspSuccess(
                rsp,
                'GetOneLocation',
                (json: GetOneLocationRspI) => {
                  subscriber.next(json.location);
                  subscriber.complete();
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
          },
          errRsp => {
            try {
              processRestRspError(
                errRsp,
                (err, httpErrRsp) => {
                  if (httpErrRsp.status < 500) {
                    subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                  }
                  else {
                    subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                  }
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
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
        .subscribe(
          rsp => {
            try {
              processRestRspSuccess(
                rsp,
                'GetOneReview',
                (json: GetOneReviewRspI) => {
                  subscriber.next(json.review);
                  subscriber.complete();
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
          },
          errRsp => {
            try {
              processRestRspError(
                errRsp,
                (err, httpErrRsp) => {
                  if (httpErrRsp.status < 500) {
                    subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                  }
                  else {
                    subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                  }
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
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
        .subscribe(
          rsp => {
            try {
              processRestRspSuccess(
                rsp,
                'CreateReview',
                (json: CreateReviewRspI) => {
                  subscriber.next(json.review);
                  subscriber.complete();
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
          },
          errRsp => {
            try {
              processRestRspError(
                errRsp,
                (err, httpErrRsp) => {
                  if (httpErrRsp.status === 401) {
                    subscriber.error(new FrontendError(ErrorCode.Unauthenticated, err.message));
                  }
                  else if (httpErrRsp.status === 404) {
                    subscriber.error(new FrontendError(ErrorCode.ResourceNotFound));
                  }
                  else if (httpErrRsp.status < 500) {
                    subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                  }
                  else {
                    subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                  }
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
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
        .subscribe(
          rsp => {
            try {
              processRestRspSuccess(
                rsp,
                'CreateUser',
                (json: CreateUserRspI) => {
                  subscriber.next(json.user);
                  subscriber.complete();
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
          },
          errRsp => {
            try {
              processRestRspError(
                errRsp,
                (err, httpErrRsp) => {
                  if (httpErrRsp.status === 403) {
                    subscriber.error(new FrontendError(ErrorCode.Forbidden, err.message));
                  }
                  else if (httpErrRsp.status < 500) {
                    subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                  }
                  else {
                    subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                  }
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
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
        .subscribe(
          rsp => {
            try {
              processRestRspSuccess(
                rsp,
                'LoginUser',
                (json: LoginUserRspI) => {
                  subscriber.next({ user: json.user, jwt: json.jwt });
                  subscriber.complete();
                });
            }
            catch (exception) {
              subscriber.error(exception);
            }
          },
          errRsp => {
            try {
              processRestRspError(
                errRsp,
                (err, httpErrRsp) => {
                  if (httpErrRsp.status === 401) {
                    subscriber.error(new FrontendError(ErrorCode.Unauthenticated, err.message));
                  }
                  else if (httpErrRsp.status < 500) {
                    subscriber.error(new FrontendError(ErrorCode.BadRequest, err.message));
                  }
                  else {
                    subscriber.error(new FrontendError(ErrorCode.InternalServerError));
                  }
                });
            }
            catch (exception) {
              console.log(exception);
              subscriber.error(exception);
            }
          });
    });
  }
}
