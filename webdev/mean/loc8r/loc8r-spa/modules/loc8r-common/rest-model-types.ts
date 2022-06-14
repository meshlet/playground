import { _isRecord as isRecord } from './type-guards';
/**
 * @file Defines interfaces/types for each of the data models
 * exposed by the REST API. In case of a successful response,
 * each REST API route returns a response whose body's shape
 * is derived from one of these interfaces.
 *
 * The exact shape of a body in a specific route's response
 * is controlled by interfaces defined in rest-api-response.ts.
 * The interfaces defined here include all the possible fields
 * for given models.
 *
 * @note Field types here don't necessarily match types used in
 * mongoose schemas. This is because these interfaces define
 * the format returned to the client and internally used data
 * will be converted into this form before data is sent.
 */

/** Defines shape for the review data model. */
export interface _ReviewI {
  _id: string;
  reviewer: string;
  createdOn: string;
  rating: number;
  text: string;
}

/** Defines shape for the location data model. */
export interface _LocationI {
  _id: string;
  name: string;
  rating?: number;
  address: string;
  facilities: Array<string>;
  coords: { longitude: number, latitude: number };
  openingHours: Array<{
    dayRange: string,
    opening?: string,
    closing?: string,
    closed: boolean
  }>;
  reviews: Array<_ReviewI>;
  distance: number;
}

/** Defines the shape of the user data model */
export interface _UserI {
  _id: string;
  password?: string;
  email: string;
  firstname: string;
  lastname: string;
}

/** A type guard that checks whether a value has UserI type */
export function _isUserObject(value: unknown): value is _UserI {
  if (isRecord(value)) {
    return typeof value._id === 'string' &&
      typeof value.email === 'string' &&
      typeof value.firstname === 'string' &&
      typeof value.lastname === 'string';
  }
  return false;
}
