/**
 * @file Defines the public API for the common module.
 *
 * @note Common module contains functionality utilized by all other
 * modules in the system. Hence, in case that server is split into
 * multiple applications (e.g. REST API server and HTTP server),
 * this module's code must be packaged into the release of each
 * individual application.
 */

export { _Env as Environment } from './env-parser';

export {
  _convertStrToInt as convertStrToInt,
  _convertStrToFloat as convertStrToFloat,
  _convertStrToBoolean as convertStrToBoolean
} from './helpers';

export {
  _isValid12HourClock as isValid12HourClock,
  _wrapExpressCallback as wrapExpressCallback
} from './server-helpers';

export {
  _urlEncodedFormParser as urlEncodedFormParser,
  _jsonParser as jsonParser
} from './req-parsers';

export {
  _isRecord as isRecord,
  _isKeyOf as isKeyOf,
  _typeofMatches as typeofMatches
} from './type-guards';

export {
  _Exact as Exact,
  _EmptyObject as EmptyObject
} from './util-types';

export {
  _RestResponseSuccessI as RestResponseSuccessI,
  _RestResponseFailureI as RestResponseFailureI,
  _RestResponseT as RestResonseT,
  _ValidationErrorT as ValidationErrorT,
  _RestErrorI as RestErrorI
} from './rest-api-response';
