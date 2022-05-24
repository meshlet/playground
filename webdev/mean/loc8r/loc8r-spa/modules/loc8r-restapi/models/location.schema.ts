import mongoose, { CallbackError, HydratedDocument } from 'mongoose';
import {
  isRecord,
  LocationSuccessRspUnionT,
  LocationSuccessRspTypeLiteralsT,
  LocationSuccessRspTypeLiteralToType,
  ExtractArrayElemT,
  LocationI,
  ReviewI,
  GetLocationsRspI
} from 'loc8r-common';
import { _isValid12HourClock as isValid12HourClock } from '../misc/server-helpers';
import { _Env as Environment } from '../misc/env-parser';
import {
  _BaseModelI as BaseModelI,
  _BaseMethodsI as BaseMethodsI,
  _BaseQueryHelpersI as BaseQueryHelpersI
} from './schema-base';
import { _RestError as RestError } from '../misc/rest-error';

/**
 * @todo Due to deficiencies with mongoose update validators, update operations
 * are currently not used and changes are made by first fetching document from
 * the DB and saving the changes. Possible solutions:
 *  - Implement the JSON schema validation in the MongoDB itself and parse the
 *    errors in the application. Mongoose validation can be kept for insert
 *    operations to save unnecessary trip to the DB. In this case, MongoDB
 *    validation can be disabled (for inserts operations only) using the
 *    per operation bypassDocumentValidation option.
 *
 *    Implement the MongoDB validation error parser that turns MongoDB validation
 *    errors into user-friendly messages. Custom error messages for schema paths
 *    can be provided in the app.
 *
 * - Extend mongoose update validation with a plugin. This plugin would fetch
 *   the paths to be validated from the DB server (if validation runs on the
 *   model level i.e. we don't have access to the document) so it can perform
 *   full validation on those fields (this would also mean full support for
 *   MongoDB update operators such as $inc, $push, $pull etc.). Additionally,
 *   Extend schema definition with a dependencies field where one can provide
 *   which paths the given path depends on for validation. These paths are
 *   also fetched from the server when update validation is done, so that
 *   validators can use values of other paths too.
 */

/**
 * Typescript interface describing opening hours type.
 *
 * @note If given location has different opening hours at different
 * days, an array of these would be created.
 */
export interface _OpeningHoursDocI {
  _id: mongoose.Types.ObjectId;
  dayRange: string;
  opening?: string;
  closing?: string;
  closed: boolean;
}

/**
 * Opening hours mongoose schema.
 *
 * @todo Implement opening/closing hour as a `number of minutes since midnight`.
 * @todo Implement opening/closing in such a way that each day is specified separately.
 */
const openingHoursSchema = new mongoose.Schema<_OpeningHoursDocI, mongoose.Model<_OpeningHoursDocI>>({
  dayRange: {
    type: String,
    required: [true, 'Day range must be specified.'],
    validate: {
      validator: function(value: string): boolean {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        /** @todo use regex for this */
        // The field must be provided in one of the following formats:
        // Day1 - Day2 where Day1 != Day2 or
        // Day
        // In both cases, `Day` must be a valid day of the week
        const [rangeStart, rangeEnd] = value.split('-');
        if (rangeStart == null) {
          return false;
        }
        else if (rangeEnd == null) {
          // This must be the `Day` format
          return days.indexOf(rangeStart) !== -1;
        }
        else if (rangeStart[rangeStart.length - 1] !== ' ' || rangeEnd[0] !== ' ') {
          // Make sure there's a space after Day1 and before Day2 in `Day1 - Day2`
          return false;
        }

        // Validate that Day1 and Day2 in `Day1 - Day2` string are actual days and Day1 != Day2
        return (days.indexOf(rangeStart.substring(0, rangeStart.length - 1)) !== -1 &&
          days.indexOf(rangeEnd.substring(1)) !== -1 && rangeStart !== rangeEnd);
      },
      message: function(props: { value: string }) {
        console.log(`${props.value} is not a valid day range.`);
        return 'Day range must be provided as a day range (e.g. \'Monday - Friday\') or as a single day (e.g.\'Friday\').';
      }
    }
  },
  opening: {
    type: String,
    required: [
      function(this: _OpeningHoursDocI) { return this.closed === false; },
      'Opening hour must be specified if venue is not closed on a given day.'
    ],
    validate: {
      validator: function(value: string | undefined): boolean {
        if (value != null) {
          return isValid12HourClock(value);
        }
        return true;
      },
      message: function(props: { value: string }) {
        console.log(`${props.value} is not a valid time of day. 12-hour format (e.g. 1:30 p.m.) is required.`);
        return 'Time of day must be in 12-hour format (e.g. 1:30 p.m.).';
      }
    }
  },
  closing: {
    type: String,
    required: [
      function(this: _OpeningHoursDocI) { return this.closed === false; },
      'Closing hour must be specified if venue is not closed on a given day.'
    ],
    validate: {
      validator: function(value: string | undefined): boolean {
        if (value != null) {
          return isValid12HourClock(value);
        }
        return true;
      },
      message: function(props: { value: string }) {
        console.log(`${props.value} is not a valid closing hour. 12-hour format (e.g. 1:30 p.m.) is required.`);
        return 'Time of day must be in 12-hour format (e.g. 1:30 p.m.).';
      }
    }
  },
  closed: {
    type: Boolean,
    required: [true, 'Venue must be either closed or opened on any given day.']
  }
});

/**
 * Typescript interface describing a single review.
 */
export interface _ReviewDocI {
  _id: mongoose.Types.ObjectId;
  reviewer: string;
  createdOn?: Date;
  rating: number;
  text: string;
}

/**
 * Review mongoose schema.
 */
const reviewerRegex = /^[a-zA-Z0-9]+[ a-zA-Z0-9]*$/;
const reviewSchema = new mongoose.Schema<_ReviewDocI, mongoose.Model<_ReviewDocI>>({
  reviewer: {
    type: String,
    required: [true, 'Reviewer\'s name must be provided.'],
    validate: {
      validator: function(value: string): boolean {
        const trimmedValue = value.trim();
        if (trimmedValue.length < 1 || trimmedValue.length > 50) {
          throw new Error('Reviewer\'s name must be between 1 and 50 characters long. Spaces at beginning and end are ignored.');
        }
        if (!reviewerRegex.test(trimmedValue)) {
          throw new Error('Reviewer\'s name may contain characters a-z and A-Z, digits and spaces in between them.');
        }
        return true;
      }
    }
  },
  createdOn: {
    type: Date,
    default: new Date(Date.now())
  },
  rating: {
    type: Number,
    required: [true, 'Rating must be provided.'],
    validate: {
      validator: function(value: number): boolean {
        return Number.isInteger(value) && value >= 1 && value <= 5;
      },
      message: function(props: { value: number }) {
        console.log(`${props.value} is not a valid rating. Rating must be a whole number between 1 and 5.`);
        return 'Rating must be a whole number between 1 and 5.';
      }
    }
  },
  text: {
    type: String,
    required: [true, 'Review text must be provided.'],
    validate: {
      validator: function(value: string): boolean {
        const trimmedValue = value.trim();
        if (trimmedValue.length < 1 || trimmedValue.length > 1000) {
          throw new Error('Review text must be between 1 and 1000 characters long. Spaces at beginning and end are ignored.');
        }
        return true;
      }
    }
  }
});

/**
 * Autogenerate createdOn date whenever a new review is created or a review is
 * updated.
 *
 * @note This behavior can be changed by setting the
 * ALLOW_MANUAL_UPDATE_OF_CREATED_ON_PATHS environment variable to true.
 * This variable must be held false in production.
 *
 * @todo Trim reviewer and text paths before document is saved and if
 * paths are modified. Remove the trimming from the validators once
 * this is implemented.
 */
if (!Environment.ALLOW_MANUAL_UPDATE_OF_CREATED_ON_PATHS) {
  reviewSchema.pre('save', function(this: mongoose.HydratedDocument<_ReviewDocI>, next: (err?: CallbackError) => void) {
    if (this.isNew) {
      this.createdOn = new Date(Date.now());
    }
    else if (this.isDirectModified('reviewer') || this.isDirectModified('text') || this.isDirectModified('rating')) {
      this.createdOn = new Date(Date.now());
    }
    else {
      // Otherwise, delete createdOn property to prevent manual updates
      delete this.createdOn;
    }
    next();
  });
}

/**
 * Typescript interface describing a single GeoJSON point.
 */
interface _GeoPointDocI {
  _id: mongoose.Types.ObjectId;
  type: 'Point';
  coordinates: [number, number];
}

/**
 * GeoJSON point schema.
 *
 * This defines the structure of a GeoJSON point. MongoDB supports geospatial
 * queries on GeoJSON objects with this structure.
 */
const geoPointSchema = new mongoose.Schema<_GeoPointDocI, mongoose.Model<_GeoPointDocI>>({
  type: {
    type: String,
    required: [true, 'Type property of GeoPoint schema must be set to Point'],
    enum: ['Point']
  },
  coordinates: {
    type: [Number],
    required: [true, 'Venue coordinates must be provided.'],
    validate: {
      validator: function(value: Array<number>): boolean {
        // Array must contain two elements, longitude followed by latitude. Longitude
        // must be a number between -180 and 180 while latitude must be a number between
        // -90 and 90.
        return value.length === 2 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90;
      },
      message: function(props: { value: Array<number> }) {
        console.log(`(${props.value.toString()}) doesn't represent valid coordinates.`);
        return 'The longitude (first coordinate) must be a number between -180 and 180 and the latitude (second coordinate) must be between -90 and 90.';
      }
    }
  }
});

/**
 * Typescript interface describing a single location.
 */
export interface _LocationDocI {
  _id: mongoose.Types.ObjectId;
  name: string;
  rating?: number;
  address: string;
  facilities: mongoose.Types.Array<string>;
  coords: _GeoPointDocI;
  openingHours: mongoose.Types.DocumentArray<_OpeningHoursDocI>;
  reviews: mongoose.Types.DocumentArray<_ReviewDocI>;
}
/** Assert that _LocationDocI union of keys is subset of keys in LocationI interface. */
const _staticAssert: keyof _LocationDocI extends keyof LocationI ? true : never = true;
void (_staticAssert);

/**
 * Typescript interface for location model instance methods.
 */
interface LocationMethodsI extends BaseMethodsI {
  setCoordinates: (this: HydratedDocument<_LocationDocI>, value: unknown) => void;
}

/**
 * Valid types for the _LocationModelI.toObject's value parameter.
 */
type ToObjectParamValueT =
  (Partial<_LocationDocI> & { distance?: number }) |
  Array<Partial<_LocationDocI> & { distance?: number }> |
  (Partial<_ReviewDocI> & { locationName: _LocationDocI['name'] });

/**
 * LocationModel interface.
 *
 * @note Methods defined on this interface are LocationModel statics.
 */
export interface _LocationModelI extends BaseModelI<_LocationDocI, BaseQueryHelpersI, LocationMethodsI> {
  /** More info in BaseModelI interface docs. */
  toObject<LocationSucessRspTypeLiteralT extends LocationSuccessRspTypeLiteralsT>(
    value: ToObjectParamValueT, desiredTypeStr: LocationSucessRspTypeLiteralT)
  : LocationSuccessRspTypeLiteralToType<LocationSucessRspTypeLiteralT>;

  /** Converts { longitude, latitude } object into an array [longitude, latitude]. */
  coordsObjToCoordsArray(obj: unknown): Array<unknown>;
}

/**
 * Location schema defines structure and validation rules for a single
 * location.
 */
export const _locationSchema = new mongoose.Schema<_LocationDocI, _LocationModelI>({
  name: {
    type: String,
    required: [true, 'Venue name must be provided.'],
    minlength: [1, 'Venue name must contain at least 1 and at most 50 characters.'],
    maxlength: [50, 'Venue name must contain at least 1 and at most 50 characters.']
  },
  rating: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: [true, 'Venue address must be provided.'],
    minlength: [1, 'Venue address must contain at least 1 and at most 200 characters.'],
    maxlength: [200, 'Venue address must contain at least 1 and at most 200 characters.']
  },
  facilities: [String],
  coords: {
    type: geoPointSchema,
    required: [true, 'Venue coordinates must be provided.'],
    // Create a 2dsphere index on the coords in order to speed-up geo-spatial
    // queries on this path.
    index: '2dsphere',
    reportErrOnTopLevelPath: true
  },
  openingHours: {
    type: [openingHoursSchema],
    required: [true, 'Venue opening hours must be provided.'],
    validate: {
      validator: function(value: Array<_OpeningHoursDocI>): boolean {
        return value.length > 0;
      },
      message: function() { return 'Venue opening hours must be provided.'; }
    }
  },
  reviews: [reviewSchema]
});

/**
 * Implement static toObject method that transforms document(s) (lean
 * or hydrated) into an object to be sent to the client.
 *
 * More details in the brief for toObject static in schema-base.ts.
 */
_locationSchema.static(
  'toObject',
  function(
    value: ToObjectParamValueT,
    desiredTypeStr: LocationSuccessRspTypeLiteralsT)
    : LocationSuccessRspUnionT {
    /** Map array of review documents into array of ReviewI objects. */
    function transformReviews(reviews?: Array<_ReviewDocI>): Array<ReviewI> {
      return reviews?.map<ReviewI>(review => {
        return {
          _id: review._id.toString(),
          reviewer: review.reviewer,
          createdOn: review.createdOn?.toISOString() || '',
          rating: review.rating,
          text: review.text
        };
      }) || [];
    }
    switch (desiredTypeStr) {
      case 'GetLocations':
      {
        if (!Array.isArray(value)) {
          break;
        }
        return {
          type: desiredTypeStr,
          locations: value.map<ExtractArrayElemT<GetLocationsRspI['locations']>>(doc => {
            if ('name' in doc) {
              return {
                _id: doc._id?.toString() || '',
                name: doc.name || '',
                rating: doc.rating,
                address: doc.address || '',
                facilities: doc.facilities || [],
                distance: doc.distance || -1
              };
            }
            throw new RestError(500, 'Unexpected server error has occured.');
          })
        };
      }
      case 'GetOneLocation':
      {
        if (Array.isArray(value)) {
          break;
        }
        if ('name' in value) {
          return {
            type: desiredTypeStr,
            location: {
              _id: value._id?.toString() || '',
              name: value.name || '',
              rating: value.rating,
              address: value.address || '',
              facilities: value.facilities || [],
              coords: {
                longitude: value.coords?.coordinates[0] || 0,
                latitude: value.coords?.coordinates[1] || 0
              },
              openingHours: value.openingHours || [],
              reviews: transformReviews(value.reviews)
            }
          };
        }
        break;
      }
      case 'CreateLocation':
      case 'UpdateLocation':
      {
        if (Array.isArray(value)) {
          break;
        }
        if ('name' in value) {
          return {
            type: desiredTypeStr,
            location: {
              _id: value._id?.toString() || '',
              name: value.name || '',
              rating: value.rating,
              address: value.address || '',
              facilities: value.facilities || [],
              coords: {
                longitude: value.coords?.coordinates[0] || 0,
                latitude: value.coords?.coordinates[1] || 0
              },
              openingHours: value.openingHours || []
            }
          };
        }
        break;
      }
      case 'GetOneReview':
      {
        if ('locationName' in value) {
          return {
            type: desiredTypeStr,
            locationName: value.locationName || '',
            review: {
              _id: value._id?.toString() || '',
              reviewer: value.reviewer || '',
              createdOn: value.createdOn?.toISOString() || '',
              rating: value.rating || 0,
              text: value.text || ''
            }
          };
        }
        break;
      }
      case 'CreateReview':
      case 'UpdateReview':
      {
        if ('reviewer' in value) {
          return {
            type: desiredTypeStr,
            review: {
              _id: value._id?.toString() || '',
              reviewer: value.reviewer || '',
              createdOn: value.createdOn?.toISOString() || '',
              rating: value.rating || 0,
              text: value.text || ''
            }
          };
        }
        break;
      }
      case 'DeleteLocation':
      case 'DeleteReview':
      {
        return {
          type: desiredTypeStr
        };
      }
      default:
      {
        const _exhaustiveCheck: never = desiredTypeStr;
        void (_exhaustiveCheck);
        break;
      }
    }
    throw new RestError(500, 'Unexpected server error has occured.');
  });

/**
 * Define a static used to convert coordinates in object form (i.e.
 * `{` longitude, latitude `}`) into an array whose first element
 * is longitude and second is latitude.
 */
_locationSchema.static(
  'coordsObjToCoordsArray',
  function(value: unknown): Array<unknown> {
    const retValue = [];
    if (isRecord(value)) {
      if (value.longitude != null) {
        retValue.push(value.longitude);
      }
      if (value.latitude != null) {
        retValue.push(value.latitude);
      }
    }
    return retValue;
  }
);

/**
 * Define an instance method that can be used set coords path by passing a
 * `{` longitude, latitude `}` object.
 *
 * Type checks / casting isn't done intentionaly. It is expected that
 * document will be saved after these changes at which point casting
 * will happen.
 *
 * @todo This method should probably throw an error if value is not
 * a record. The current implementation won't report an error at
 * all if a non-object is sent by the client as coords, and server
 * might send 200 OK response even though coordinates weren't
 * actually updated.
 */
_locationSchema.method(
  'setCoordinates',
  function(this: HydratedDocument<_LocationDocI>, value: unknown) {
    if (isRecord(value)) {
      if (value.longitude != null) {
        this.set('coords.coordinates.0', value.longitude);
      }
      if (value.latitude != null) {
        this.set('coords.coordinates.1', value.latitude);
      }
    }
  });

/**
 * @todo Implement rating field as a mongoose virtual using mongoose-lean-virtuals
 * to include the field in lean objects. This will get rid of the need to compute
 * rating from the reviews at every save as well as remove the need to prevent
 * manual rating update.
 */
_locationSchema.pre('save', function(this: HydratedDocument<_LocationDocI>, next: (err?: CallbackError) => void) {
  if (this.rating) {
    // Rating value is calculated and can't be updated manually
    delete this.rating;
  }
  if (this.isModified('reviews')) {
    // The reviews path have been modified. Re-calculate the average rating
    // for this location.
    let sum = 0;
    this.reviews.forEach((value) => {
      sum += value.rating;
    });
    this.rating = sum / this.reviews.length;
  }

  next();
});
