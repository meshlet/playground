import mongoose from 'mongoose';
import {
  _transformMongooseErrorPlugin as transformMongooseErrorPlugin,
  _configureToJsonMethodPlugin as configureToJsonMethodPlugin
} from './mongoose-plugins';
// mongoose-beautiful-unique-validation package has no available TS types
// eslint-disable-next-line @typescript-eslint/no-var-requires
const beautifyUniqueErrors = require('mongoose-beautiful-unique-validation') as (_: mongoose.Schema<unknown>) => void;

/**
 * @file Sets up all global mongoose state. This includes global
 * flags, plugins as well as overriding any global mongoose behavior
 * such as value casting.
 *
 * @note This function must be invoked before any mongoose models are built
 * to make sure all global plugins get attached to schemas.
 */
export function _configureMongoose() {
  /**
   * Set mongoose's global options.
   *
   * - satinizeFilter: prevents query injection attacks
   * - sanitizeProjection: prevents selecting arbitrary fields via select method
   * - castNonArrays: prevent mongoose from wrapping non-array value in an array before casting.
   */
  mongoose.set('sanitizeFilter', true);
  mongoose.set('sanitizeProjection', true);
  mongoose.Schema.Types.Array.options.castNonArrays = false;
  mongoose.Schema.Types.DocumentArray.options.castNonArrays = false;

  /**
  * Override some of mongoose's built-in casting functions.
  */
  const originalNumberCast = mongoose.Schema.Types.Number.cast();
  mongoose.Schema.Types.Number.cast((v: unknown) => {
    if (typeof v === 'string' && v.length > 50) {
      // We don't want to parse strings whose length is over 50 characters.
      // Under no circumstances do we need numbers so large or small.
      return NaN;
    }
    // mongoose.Schema.Types.Number.cast has return type set to Function, hence
    // eslint complains about `unsafe return of any`.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return originalNumberCast(v);
  });

  /**
  * Register global plugins.
  */
  /** @todo Verify how Validation error prop names look like when unique restriction is validated for a nested path. */
  mongoose.plugin(beautifyUniqueErrors);
  mongoose.plugin(configureToJsonMethodPlugin);
  mongoose.plugin(transformMongooseErrorPlugin);
}
