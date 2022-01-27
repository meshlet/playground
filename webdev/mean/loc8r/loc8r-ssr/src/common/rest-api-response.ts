/**
 * @file Defines TypeScript type for the REST API response.
 */

/**
 * Success response has a data property whose value is an object
 * containing response data. How this data looks like varies
 * between different routes. Check the route and its associated
 * controller for more info.
 *
 * @todo Each route will have its own ResponseType using discriminating
 * union to build a type that covers all possible types. `data` property
 * will than have this union type (or an array of these);
 */
export interface _RestResponseSuccessI {
  success: true,
  data: unknown | Array<unknown>
}

/**
 * A type describing the error object returned as part of the
 * the error in case create/update request failed due to
 * validation errors.
 */
export type _ValidationErrorT = Record<string, string | undefined>;

/**
 * An interface describing the structure of an error returned
 * as part of a failure response. It always includes a message
 * and optionally includes a validation error object in case
 * create/update operation failed due to validation errors.
 */
export interface _RestErrorI {
  message: string,
  validationErr?: _ValidationErrorT,
}

/**
 * Describes object sent to the client in case of an error that occurs
 * during processing of a request.
 */
export interface _RestResponseFailureI {
  success: false,
  error: _RestErrorI
}

/**
 * A union discriminated based on the success property.
 */
export type _RestResponseT = _RestResponseSuccessI | _RestResponseFailureI;
