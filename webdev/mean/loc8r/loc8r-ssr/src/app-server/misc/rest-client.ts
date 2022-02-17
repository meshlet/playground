import fetch from 'node-fetch';
import {
  Environment,
  RestResponseT,
  isRecord,
  isRecordGeneric,
  HttpError,
  SuccessRspUnionT,
  SuccessRspTypeLiteralsT,
  SuccessRspTypeLiteralToType,
  RestErrorI
} from '../../common/common.module';
import {
  _HttpRspErrorRedirect as HttpRspErrorRedirect
} from '../misc/http-rsp-error';
import { URLSearchParams } from 'url';

/** @todo Rest client code needs to reside in common module and be
    accessible to client side. For client side to be able to use it,
    REST client will have to utilize an isomorphic fetch that uses
    node-fetch on server and browser's fetch on client. */

/**
 * @file Uses node-fetch to access the REST API. This is the only
 * place that should access the node-fetch module, the controllers
 * must use function exported here to fetch/push data to/from
 * the app server.
 *
 * This module additionally exports functions that capture common
 * parts of handling of REST API responses.
 *
 * @note The response body is always parsed as JSON as this is the
 * data type sent by the REST server.
 *
 * @note Promises returned by REST client functions either resolve
 * with data from the rest API or reject with an error indicating
 * inability to read data from the rest API server.
 *
 * @note Promises returned by REST client function will reject only
 * if an unexpected server error occurs (e.g. REST server is down).
 * HTTP responses with 4xx or 5xx status code are not considered errors
 * and must be handled in the regular code path.
 */

/** Base URL for the REST API server. */
const restApiBaseUri = `http://${Environment.REST_SERVER_ADDRESS}:${Environment.REST_SERVER_PORT}/api`;

/** The return type for each of the _fetch* methods exported by rest-client. */
export interface _RestClientRetTypeI {
  statusCode: number;
  json: unknown;
}

/**
 * Sends a GET request to the REST server and parses response as JSON.
 */
export async function _restGet(reqUri: string, searchParams?: URLSearchParams)
: Promise<_RestClientRetTypeI> {
  const searchParamsStr = searchParams ? `?${searchParams.toString()}` : '';
  const response = await fetch(`${restApiBaseUri}/${reqUri}${searchParamsStr}`);
  return {
    statusCode: response.status,
    json: await response.json()
  };
}

/**
 * Sends a POST request to the REST server and parses response as JSON.
 *
 * @note The Content-Type is automatically set to application/x-www-form-urlencoded
 * by node-fetch because body type is URLSearchParams.
 */
export async function _restPostUrlEnc(
  reqUri: string,
  bodyParams: URLSearchParams,
  searchParams?: URLSearchParams)
: Promise<_RestClientRetTypeI> {
  const searchParamsStr = searchParams ? `?${searchParams.toString()}` : '';
  const response = await fetch(
    `${restApiBaseUri}/${reqUri}${searchParamsStr}`, {
      method: 'POST',
      body: bodyParams
    });

  return {
    statusCode: response.status,
    json: await response.json()
  };
}

/**
 * A type-guard that makes sure the response received from the
 * REST server is as defined in common/rest-api-response.ts.
 */
function isValidRestResponse(resBody: unknown): resBody is RestResponseT {
  if (isRecord(resBody)) {
    if (resBody.success === true) {
      return true;
    }
    else if (resBody.success === false) {
      if (!isRecord(resBody.error)) {
        // Malformed REST response
        return false;
      }
      if (typeof resBody.error.message !== 'string') {
        // Malformed REST response
        return false;
      }
      if (resBody.error.validationErr &&
          !isRecordGeneric(resBody.error.validationErr, 'string')) {
        // Malformed REST response
        return false;
      }
      return true;
    }
  }
  // Malformed REST response
  throw new HttpError(500);
}

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
export function _processRestResponse<SuccessRspTypeLiteralT extends SuccessRspTypeLiteralsT>(
  restApiRes: _RestClientRetTypeI,
  expectedSuccessRspType: SuccessRspTypeLiteralT,
  handleSuccessRspCb: (restRspBody: SuccessRspTypeLiteralToType<SuccessRspTypeLiteralT>) => void,
  handleFailureRspCb: (error: RestErrorI) => void): void;
export function _processRestResponse(restApiRes: _RestClientRetTypeI,
                                     expectedSuccessRspType: SuccessRspTypeLiteralsT,
                                     handleSuccessRspCb: (restRspBody: SuccessRspUnionT) => void,
                                     handleFailureRspCb: (error: RestErrorI) => void) {
  if (!isValidRestResponse(restApiRes.json)) {
    // Unexpected response received from the REST server
    /** @todo should set flash message. Perhaps flash can set by the server error middleware. */
    throw new HttpRspErrorRedirect(
      '/error',
      'Operation could not be completed due to an internal server error.');
  }
  if (restApiRes.json.success) {
    if (restApiRes.json.body.type !== expectedSuccessRspType) {
      // Unexpected response type received from the REST server
      /** @todo Set flash message. */
      throw new HttpRspErrorRedirect(
        '/error',
        'Operation could not be completed due to an internal server error.');
    }
    handleSuccessRspCb(restApiRes.json.body);
  }
  else {
    handleFailureRspCb(restApiRes.json.error);
  }
}
