/**
 * @file Defines the public API for the common module.
 *
 * @note Common module contains functionality utilized by all other
 * modules in the system. Hence, in case that server is split into
 * multiple applications (e.g. REST API server and HTTP server),
 * this module's code must be packaged into the release of each
 * individual application.
 */

export {
  _convertStrToInt as convertStrToInt,
  _convertStrToFloat as convertStrToFloat,
  _convertStrToBoolean as convertStrToBoolean
} from './helpers';

export {
  _isRecord as isRecord,
  _isRecordGeneric as isRecordGeneric,
  _isKeyOf as isKeyOf,
  _typeofMatches as typeofMatches,
  _hasOwnProperty as hasOwnProperty
} from './type-guards';

export {
  _Exact as Exact,
  _EmptyObject as EmptyObject,
  _FunctionT as FunctionT,
  _ExtractArrayElemT as ExtractArrayElemT,
  _ContainsKeyT as ContainsKeyT,
  _ContainsKeyExtendedT as ContainsKeyExtendedT
} from './util-types';

export {
  _ReviewI as ReviewI,
  _LocationI as LocationI,
  _UserI as UserI,
  _isUserObject as isUserObject
} from './rest-model-types';

export {
  _RestResponseSuccessI as RestResponseSuccessI,
  _RestResponseSuccessGenericI as RestResponseSuccessGenericI,
  _RestResponseFailureI as RestResponseFailureI,
  _RestResponseT as RestResponseT,
  _ValidationErrorT as ValidationErrorT,
  _RestErrorI as RestErrorI,
  _GetLocationsRspI as GetLocationsRspI,
  _GetOneLocationRspI as GetOneLocationRspI,
  _CreateLocationRspI as CreateLocationRspI,
  _UpdateLocationRspI as UpdateLocationRspI,
  _DeleteLocationRspI as DeleteLocationRspI,
  _GetOneReviewRspI as GetOneReviewRspI,
  _CreateReviewRspI as CreateReviewRspI,
  _UpdateReviewRspI as UpdateReviewRspI,
  _DeleteReviewRspI as DeleteReviewRspI,
  _CreateUserRspI as CreateUserRspI,
  _LoginUserRspI as LoginUserRspI,
  _LocationSuccessRspTypeLiteralsT as LocationSuccessRspTypeLiteralsT,
  _UserSuccessRspTypeLiteralsT as UserSuccessRspTypeLiteralsT,
  _SuccessRspTypeLiteralsT as SuccessRspTypeLiteralsT,
  _LocationSuccessRspTypeLiteralToType as LocationSuccessRspTypeLiteralToType,
  _UserSuccessRspTypeLiteralToType as UserSuccessRspTypeLiteralToType,
  _SuccessRspTypeLiteralToType as SuccessRspTypeLiteralToType,
  _LocationSuccessRspUnionT as LocationSuccessRspUnionT,
  _UserSuccessRspUnionT as UserSuccessRspUnionT,
  _SuccessRspUnionT as SuccessRspUnionT,
  _isValidRestResponse as isValidRestResponse
} from './rest-api-response';

export { _ErrorBase as ErrorBase } from './error';
