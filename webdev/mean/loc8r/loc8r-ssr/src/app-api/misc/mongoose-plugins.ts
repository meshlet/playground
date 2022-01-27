import { Schema, Error, CallbackError, HydratedDocument, Query } from 'mongoose';
import { _RestError as RestError } from './error';

/**
 * @file Re-usable mongoose plugins implementing common functionality
 * required by many schemas.
 */

/**
 * A plugin that attaches error handling middleware to all
 * relevant post hooks. The purpose is to transform the mongoose
 * error into simplified format sent to the API client.
 *
 * @note As using mongoose's update methods is forbidden, the
 * error middleware is registered only for save and find post
 * hooks.
 *
 * @note For some nested schema paths, it might be useful to report
 * validation errors on the top-level path instead of reporting it
 * on the nested path. Plugin makes this possible using the
 * reportErrOnTopLevelPath SchemaType option. To make sure that
 * any error for a top-level path and its children gets reported
 * on the top-level path, set this option to true within top-level
 * path's SchemaType options.
 */
export function _transformMongooseErrorPlugin(schema: Schema<unknown>): void {
  function transformMongooseError(err: Error, _: unknown, next: (err?: CallbackError) => void) {
    const transformedErr = new RestError(400);
    function transformValidationError(err: Error.ValidationError): void {
      if (transformedErr.validationErr == null) {
        transformedErr.validationErr = {};
      }

      for (const fullPath in err.errors) {
        const errObj = err.errors[fullPath];
        // Check whether errors should be reported at top-level path
        let targetPath = fullPath;
        const splitPath = fullPath.split('.');
        if (schema.path(splitPath[0]).options.reportErrOnTopLevelPath) {
          // Errors must be reported at top-level path.
          targetPath = splitPath[0];
        }
        if (errObj instanceof Error.ValidatorError) {
          transformedErr.validationErr[targetPath] = errObj.message;
        }
        else if (errObj instanceof Error.CastError) {
          /** @todo Introduce customCastError property to SchemaType that can be used to customize CastError message. */
          transformedErr.validationErr[targetPath] = 'Provided data does not have expected format.';
        }
        else {
          // Recurse into the validation error.
          transformValidationError(errObj);
        }
      }
    }
    if (err instanceof Error.ValidationError) {
      transformedErr.message = 'Action failed due to missing or malformed data.';
      transformValidationError(err);
    }
    else {
      /** @todo Not each of the remaining Mongoose errors indicates internal server error. Some of them correspond to invalid request. */
      transformedErr.statusCode = 500;
      transformedErr.message = 'Action failed due to an internal server error.';
    }

    next(transformedErr);
  }

  schema.post('save', transformMongooseError);
  schema.post(['find', 'findOne'], transformMongooseError);
}

/**
 * Plugin accepts a custom toJSON method via options, and uses
 * scheme.set('toJSON') to override built-in toJSON method. The
 * custom toJSON is also attached to lean documents in post('find')
 * middleware.
 *
 * @note Expectation is that this plugin will be registered globally
 * to make sure that version key is omitted from data sent as part
 * of the response. Moreover, schemas that need to modify the document
 * before response is sent are expected to use this pluging locally
 * with a custom toJSON function.
 */
export function _configureToJsonMethodPlugin<T = unknown>(schema: Schema<T>,
                                                          options?: { toJSON: () => Record<string, unknown> }) {
  if (options == null) {
    // Configure the toJSON method to exclude version key from the
    // hydrated document. Additonally, restore the previous value
    // of the transform property, if it exists. This makes sure that
    // custom transform function registered by per-schema plugin doesn't
    // get overwritten by a global plugin registration for which the
    // options.toJSON property is null. Omitting transform property or
    // setting it to undefined in schema.set options removes its previous
    // value.
    schema.set('toJSON', {
      versionKey: false,
      transform: schema.get('toJSON')?.transform
    });
  }
  else {
    // Make sure custom toJSON is called hydrated documents
    schema.set('toJSON', {
      versionKey: false,
      transform: (doc: HydratedDocument<unknown>): Record<string, unknown> => {
        return options.toJSON.apply(doc);
      }
    });

    // Attach custom toJSON method to lean documents
    schema.post(['find', 'findOne'], function(
      this: Query<unknown, unknown>,
      value: Record<string, unknown> | Array<Record<string, unknown>> | undefined,
      next: (err?: CallbackError) => void)
    : void {
      if (!this.mongooseOptions().lean) {
        return next();
      }
      else if (value == null) {
        return next();
      }

      if (Array.isArray(value)) {
        value.forEach((doc: Record<string, unknown>): void => {
          doc.toJSON = options.toJSON;
        });
      }
      else {
        value.toJSON = options.toJSON;
      }
      next();
    });
  }
}
