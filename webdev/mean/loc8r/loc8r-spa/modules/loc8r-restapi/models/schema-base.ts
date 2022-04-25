import { Model } from 'mongoose';
import { SuccessRspTypeLiteralToType, SuccessRspTypeLiteralsT } from 'loc8r-common';

/**
 * @file Base model interfaces that must be implemented by
 * by every top-level mongoose schema.
 *
 * This includes common query helpers, methods and virtuals
 * as well as common static methods.
 */

/**
 * The base interface defining query helper methods that have to be
 * implemented by all schemas (by setting schema.query.* properties
 * to query helper functions).
 *
 * @note If a concret model must add additional query helpers, its
 * query helpers interface must extend the base one.
 */
// Disable the rule because we want to keep these empty interfaces for future.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface _BaseQueryHelpersI {}

/**
 * The base interface defining instance methods to be implemented
 * by all schemas (via Schema.prototype.method()).
 *
 * @note If a concret model must add additional instance methods, its
 * instance methods interface must extend the base one.
 */
// Disable the rule because we want to keep these empty interfaces for future.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface _BaseMethodsI {}

/**
 * The base interface defining virtuals (as properties) to be
 * implemented by all schemas (via Schema.prototype.virtual()).
 *
 * @note If a concret model must add additional virtuals, its
 * virtuals interface must extend the base one.
 */
// Disable the rule because we want to keep these empty interfaces for future.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface _BaseVirtualsI {}

/**
 * The base model interface.
 *
 * RestT template argument should be set to an interface from
 * common/rest-model-types.ts that matches the given schema. E.g.
 * for location schema that would be LocationI interface.
 */
export interface _BaseModelI<DocT, QueryHelpersT = _BaseQueryHelpersI, MethodsT = _BaseMethodsI, VirtualsT = _BaseVirtualsI>
  extends Model<DocT, QueryHelpersT, MethodsT, VirtualsT> {
  /**
   * Converts a document (lean or hydrated) or array of documents into
   * a plain Javascript object format sent to the client.
   *
   * This static gives model a chance to transform mongoose document
   * into the format that is sent in the body of a successful response.
   *
   * Note that return type of toObject method resolves to a type
   * that corresponds the the passed in REST body type literal
   * (RestBodyTypeLiteralsT defined in common/rest-api-response.ts).
   * It is up to the caller to decide what return type should be,
   * depending on the use-case. For example, if a list of locations
   * have been obtained from the DB, the invocation would be
   * toObject(docs, 'GetLocations'), ensure that return type of
   * the call is GetLocationsBodyI.
   */
  toObject<T, SuccessRspTypeLiteralT extends SuccessRspTypeLiteralsT>(
    value: T, desiredTypeStr: SuccessRspTypeLiteralT): SuccessRspTypeLiteralToType<SuccessRspTypeLiteralT>;
  // toObject<T, SuccessRspTypeLiteralT extends SucessRspTypeLiteralsT>(
  //   value: Array<T>, desiredTypeStr: SuccessRspTypeLiteralT): SuccessRspTypeLiteralToType<SuccessRspTypeLiteralT>;
}
