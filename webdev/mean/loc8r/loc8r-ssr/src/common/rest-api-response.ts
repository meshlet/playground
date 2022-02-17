import { _LocationI as LocationI, _ReviewI as ReviewI } from './rest-model-types';

/**
 * @file Defines TypeScript type for the REST API response.
 */

/**
 * Body of a succesfull response to a request for a list of locations.
 */
export interface _GetLocationsRspI {
  type: 'GetLocations';
  locations: Array<Pick<LocationI, '_id' | 'name' | 'rating' | 'address' | 'facilities' | 'distance'>>;
}

/**
 * Body of a sucessfull response to a request for a specific location.
 */
export interface _GetOneLocationRspI {
  type: 'GetOneLocation';
  location: Omit<LocationI, 'distance'>;
}

/**
 * Body of a successfull response to a request to create a new location.
 */
export interface _CreateLocationRspI {
  type: 'CreateLocation';
  location: Omit<LocationI, 'distance' | 'reviews'>;
}

/**
 * Body of a successfull response to a request to update existing location.
 */
export interface _UpdateLocationRspI {
  type: 'UpdateLocation';
  location: _CreateLocationRspI['location'];
}

/**
 * Body of a successfull response to a request to delete existing location.
 */
export interface _DeleteLocationRspI {
  type: 'DeleteLocation';
}

/**
 * Body of a successfull response to obtain a specific review.
 */
export interface _GetOneReviewRspI {
  type: 'GetOneReview';
  locationName: LocationI['name'];
  review: ReviewI;
}

/**
 * Body of a successfull response to a request to create a new review.
 */
export interface _CreateReviewRspI {
  type: 'CreateReview';
  review: ReviewI;
}

/**
 * Body of a successfull response to a request to update existing review.
 */
export interface _UpdateReviewRspI {
  type: 'UpdateReview';
  review: ReviewI;
}

/**
 * Body of a successfull response to a request to delete existing review.
 */
export interface _DeleteReviewRspI {
  type: 'DeleteReview';
}

/**
 * A discriminated union of all possible successfull response body types.
 */
export type _SuccessRspUnionT =
  _GetLocationsRspI |
  _GetOneLocationRspI |
  _CreateLocationRspI |
  _UpdateLocationRspI |
  _DeleteLocationRspI |
  _GetOneReviewRspI |
  _CreateReviewRspI |
  _UpdateReviewRspI |
  _DeleteReviewRspI;

/**
 * A union of all possible values for _SuccessRspUnionT.type property.
 */
export type _SuccessRspTypeLiteralsT = _SuccessRspUnionT['type'];

/**
 * A helper that maps response body type string literal into the body
 * type.
 */
export type _SuccessRspTypeLiteralToType<T> =
  T extends 'GetLocations' ? _GetLocationsRspI :
  T extends 'GetOneLocation' ? _GetOneLocationRspI :
  T extends 'CreateLocation' ? _CreateLocationRspI :
  T extends 'UpdateLocation' ? _UpdateLocationRspI :
  T extends 'DeleteLocation' ? _DeleteLocationRspI :
  T extends 'GetOneReview' ? _GetOneReviewRspI :
  T extends 'CreateReview' ? _CreateReviewRspI :
  T extends 'UpdateReview' ? _UpdateReviewRspI :
  T extends 'DeleteReview' ? _DeleteReviewRspI :
  never;

/**
 * Success response has a body property which is a union of all
 * possible responses. Responses are differentiated by the type
 * property in the response body.
 */
export interface _RestResponseSuccessI {
  success: true;
  body: _SuccessRspUnionT;
}

/**
 * A generic version of the _RestResponseSuccessI interface that
 * lets caller specify exact body type.
 *
 * @note This is only intended for the REST API itself. REST API
 * consumers must use _RestResponseSuccessI interface and use the
 * type property in the body to idenfity the response.
 */
export interface _RestResponseSuccessGenericI<T extends _SuccessRspUnionT> {
  success: true;
  body: T;
}

/**
 * A type describing the error object returned as part of the
 * the error in case create/update request failed due to
 * validation errors.
 */
export type _ValidationErrorT = Record<string, string>;

/**
 * An interface describing the structure of an error returned
 * as part of a failure response. It always includes a message
 * and optionally includes a validation error object in case
 * create/update operation failed due to validation errors.
 */
export interface _RestErrorI {
  message: string;
  validationErr?: _ValidationErrorT;
}

/**
 * Describes object sent to the client in case of an error that occurs
 * during processing of a request.
 */
export interface _RestResponseFailureI {
  success: false;
  error: _RestErrorI;
}

/**
 * A union discriminated based on the success property.
 */
export type _RestResponseT = _RestResponseSuccessI | _RestResponseFailureI;
