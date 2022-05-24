import { Model } from 'mongoose';

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
   * Expectation is that derived classes will use *SuccessRspTypeLiteralsT
   * types defined in loc8r-common/rest-api-response.ts to narrow down the
   * possible values for the `desiredTypeStr` parameter. Furthermore,
   * the *SuccessRspTypeLiteralToType types should be used to indicate
   * the return type of the method to the caller which depends on the
   * literal type of the `desiredTypeStr`. For instance, the user model
   * might implements this method like this:
   *
   * toObject<T, SuccessRspTypeLiteralT extends UserSuccessRspTypeLiteralsT>(
   *   value: T, desiredTypeStr: SuccessRspTypeLiteralT): UserSuccessRspTypeLiteralToType<SuccessRspTypeLiteralT>;
   *
   * whose desiredTypeStr parameter accepts only the user related success
   * response type literals and when called like this:
   *
   * toObject(doc, 'CreateUser')
   *
   * indicates that return type must be CreateUserRspI. The method in
   * this base interface has `desiredTypeStr` set to string and return type
   * set to unknown to allow derived classes to use more specific types. The
   * purpose of having this method defined in the base interface is to expose
   * toObject method on all models which makes sure it is implemented for each
   * of them.
   */
  toObject<T>(value: T, desiredTypeStr: string): unknown;
}
