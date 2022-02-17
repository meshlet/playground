import {
  RestErrorI, ValidationErrorT, HttpError
} from '../../common/common.module';

/**
 * @file Error class used by REST API to communicate errors to
 * clients.
 *
 * @note See _transformMongooseErrorPlugin mongoose plugin for details
 * on how the validationErr objects gets generated.
 *
 * @note Class extends native Error only because mongoose's TS types
 * expect that an instance of Error is passed to the NextFunction
 * callback.
 *
 * @note This class must not be used outside of app-api module. RestErrorI
 * interface exists for this purpose.
 */
export class _RestError extends HttpError implements RestErrorI {
  public validationErr?: ValidationErrorT;

  /**
   * Trims validation error property names from the start by depth segments.
   *
   * Validation error properties have fully qualified (absolute) names.
   * For example, if document has the following structure
   *
   * {
   *   parent: { child: { prop: 123 } }
   * }
   *
   * validation errors on the `prop` property are always reported on
   * the 'parent.child.prop' property. However, if the REST API consumer
   * is only interested in errors on the `child` object and not the parent,
   * this property naming is difficult to deal with. The situation becomes
   * worse if `parent` contains array of `child` objects, in which case
   * property naming would be 'parent.X.prop' where X is the array index
   * of the `child` within the array.
   *
   * To make life simpler for the REST API consumer, this function is used
   * to trim down validation error property names by given depth. For
   * example, with trimDepth=2 the 'parent.child.prop' path would be trimmed
   * down to just 'prop'.
   *
   * @note It is a bug to call this method with depth that is greater than
   * the number of segments in any property's name. Method throws 500 error
   * if this happens.
   */
  trimErrorPropNames(trimDepth: number) {
    if (!this.validationErr) {
      return;
    }
    if (trimDepth <= 0) {
      // It is illegal to call this method with a non-positive trim depth
      throw new _RestError(500, 'Request couldn\'t be completed due to an internal server error.');
    }

    const newErrObj: ValidationErrorT = {};
    for (const prop in this.validationErr) {
      const splitPropName = prop.split('.');
      if (trimDepth > splitPropName.length) {
        // This is a server bug
        throw new _RestError(500, 'Request couldn\'t be completed due to an internal server error.');
      }
      newErrObj[splitPropName.slice(trimDepth).join('.')] = this.validationErr[prop];
    }
    this.validationErr = newErrObj;
  }

  /** Called implicitly by JSON.stringify(). */
  toJSON(): RestErrorI {
    return {
      message: this.message,
      validationErr: this.validationErr ? this.validationErr : undefined
    };
  }
}
