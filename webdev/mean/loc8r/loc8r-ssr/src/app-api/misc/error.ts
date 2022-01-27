import { RestErrorI, ValidationErrorT } from '../../common/common.module';

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
export class _RestError extends Error implements RestErrorI {
 public validationErr?: ValidationErrorT;
 public statusCode;
 constructor(statusCode: number, message?: string) {
   super(message);
   Object.setPrototypeOf(this, new.target.prototype);
   this.statusCode = statusCode;
 }

 toJSON(): RestErrorI {
   return {
     message: this.message,
     validationErr: this.validationErr ? this.validationErr : undefined
   };
 }
}
