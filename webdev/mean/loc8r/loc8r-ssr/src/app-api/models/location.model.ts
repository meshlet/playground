import mongoose, { CallbackError, HydratedDocument, Query } from 'mongoose';
import { isValid12HourClock, isRecord, Environment } from '../../utils/utils.module';

// TODO: Due to deficiencies with mongoose update validators, update operations
//  are currently not used and changes are made by first fetching document from
//  the DB and saving the changes. Possible solutions:
//  - Implement the JSON schema validation in the MongoDB itself and parse the
//    errors in the application. Mongoose validation can be kept for insert
//    operations to save unnecessary trip to the DB. In this case, MongoDB
//    validation can be disabled (for inserts operations only) using the
//    per operation bypassDocumentValidation option.
//
//    Implement the MongoDB validation error parser that turns MongoDB validation
//    errors into user-friendly messages. Custom error messages for schema paths
//    can be provided in the app.
//
// - Extend mongoose update validation with a plugin. This plugin would fetch
//   the paths to be validated from the DB server (if validation runs on the
//   model level i.e. we don't have access to the document) so it can perform
//   full validation on those fields (this would also mean full support for
//   MongoDB update operators such as $inc, $push, $pull etc.). Additionally,
//   Extend schema definition with a dependencies field where one can provide
//   which paths the given path depends on for validation. These paths are
//   also fetched from the server when update validation is done, so that
//   validators can use values of other paths too.

/**
 * Typescript interface describing opening hours type.
 *
 * @note If given location has different opening hours at different
 * days, an array of these would be created.
 */
export interface _OpeningHours {
  _id?: mongoose.Types.ObjectId,
  dayRange: string,
  opening?: string,
  closing?: string,
  closed: boolean
}

/**
 * Opening hours mongoose schema.
 *
 * TODO: implement opening/closing hour as a `number of minutes since midnight`.
 * TODO: implement opening/closing in such a way that each day is specified separately
 */
const openingHoursSchema = new mongoose.Schema<_OpeningHours, mongoose.Model<_OpeningHours>>({
  dayRange: {
    type: String,
    required: [true, 'Day range must be specified.'],
    validate: {
      validator: function(value: string): boolean {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // TODO: use regex for this
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
        return 'Day range must be provided in \'Monday - Friday\' format or as a single day \'Friday\'.';
      }
    }
  },
  opening: {
    type: String,
    required: [
      function(this: _OpeningHours) { return this.closed === false; },
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
      function(this: _OpeningHours) { return this.closed === false; },
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
export interface _Review {
  _id?: mongoose.Types.ObjectId,
  reviewer: string,
  createdOn?: Date,
  rating: number,
  text: string
}

/**
 * Review mongoose schema.
 */
const reviewerRegex = /^[a-zA-Z0-9]+[ a-zA-Z0-9]*$/;
const reviewSchema = new mongoose.Schema<_Review, mongoose.Model<_Review>>({
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
  reviewSchema.pre('save', function(this: mongoose.HydratedDocument<_Review>, next: (err?: CallbackError) => void) {
    if (this.isNew) {
      this.createdOn = new Date(Date.now());
    }
    else if (this.isModified('reviewer') || this.isModified('text') || this.isModified('rating')) {
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
interface _GeoPoint {
  _id?: mongoose.Types.ObjectId,
  type: 'Point',
  coordinates: [number, number]
}

/**
 * GeoJSON point schema.
 *
 * This defines the structure of a GeoJSON point. MongoDB supports geospatial
 * queries on GeoJSON objects with this structure.
 */
const geoPointSchema = new mongoose.Schema<_GeoPoint, mongoose.Model<_GeoPoint>>({
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
export interface _Location {
  _id?: mongoose.Types.ObjectId,
  name: string,
  rating?: number,
  address: string,
  facilities: mongoose.Types.Array<string>,
  coords: _GeoPoint,
  openingHours: mongoose.Types.DocumentArray<_OpeningHours>,
  reviews: mongoose.Types.DocumentArray<_Review>
}

/**
 * Typescript interface that location model instance methods.
 */
interface LocationModelMethods {
  setCoordinates: (this: HydratedDocument<_Location>, value: unknown) => void;
}

/**
 * LocationModel interface type alias.
 *
 * @note Methods defined on this interface are LocationModel statics.
 */
interface LocationModelInterface extends mongoose.Model<_Location, unknown, LocationModelMethods> {
  coordsObjToCoordsArray(obj: unknown): Array<unknown>;
}

/**
 * Location schema defines structure and validation rules for a single
 * location.
 */
const locationSchema = new mongoose.Schema<_Location, LocationModelInterface>({
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
    index: '2dsphere'
  },
  openingHours: {
    type: [openingHoursSchema],
    required: [true, 'Venue opening hours must be provided.'],
    validate: {
      validator: function(value: Array<_OpeningHours>): boolean {
        return value.length > 0;
      },
      message: function() { return 'Venue opening hours must be provided.'; }
    }
  },
  reviews: [reviewSchema]
});

/**
 * A function that prepares the document for JSON serialization. This must
 * be done both for hydrated and lean documents. Hydrated documens are
 * handled by the transform function called by toJSON method and lean
 * documents are handled by a post find hook.
 *
 * @note This function must be invoked as an instance method, which means it
 * must either be assigned to an object before it is called or it must be
 * called via apply/call providing `this` argument.
 *
 */
function transformLocation(this: Partial<_Location>)
: Record<string, unknown> {
  const props: Array<keyof _Location> = [
    '_id', 'name', 'address', 'rating', 'facilities', 'coords', 'openingHours', 'reviews'
  ];
  const retObj: Record<string, unknown> = {};
  for (const prop of props) {
    if (prop === 'coords' && this.coords != null) {
      retObj.coordinates = {
        longitude: this.coords.coordinates[0],
        latitude: this.coords.coordinates[1]
      };
    }
    else if (this[prop]) {
      retObj[prop] = this[prop];
    }
  }
  return retObj;
}

/**
 * Define a static used to convert coordinates in object form (i.e.
 * `{` longitude, latitude `}`) into an array whose first element
 * is longitude and second is latitude.
 */
locationSchema.static(
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
 */
locationSchema.method(
  'setCoordinates',
  function(this: HydratedDocument<_Location>, value: unknown) {
    if (isRecord(value)) {
      if (value.longitude != null) {
        this.set('coords.coordinates.0', value.longitude);
      }
      if (value.latitude != null) {
        this.set('coords.coordinates.1', value.latitude);
      }
    }
  });

// Configure location schema's toJSON method
locationSchema.set('toJSON', {
  versionKey: false,
  transform: (doc: HydratedDocument<_Location>): Record<string, unknown> => {
    return transformLocation.apply(doc);
  }
});

// TODO: implement rating field as a mongoose virtual using mongoose-lean-virtuals
// to include the field in lean objects. This will get rid of the need to compute
// rating from the reviews at every save as well as remove the need to prevent
// manual rating update.
locationSchema.pre('save', function(this: mongoose.HydratedDocument<_Location>, next: (err?: CallbackError) => void) {
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

/**
 * Post find hook that attaches toJSON function to lean documents. This
 * is to make sure that both hydrated and lean documents are serialized
 * in the same way (the same transform function is used to serialize
 * hydrated docs). As findOneByIdAnd* and findOneAnd* methods are not used,
 * we don't register middleware for these.
 */
locationSchema.post(['find', 'findOne'], function(
  this: Query<unknown, unknown>,
  value: Record<string, unknown> | Array<Record<string, unknown>> | undefined)
: void {
  if (!this.mongooseOptions().lean) {
    return;
  }
  else if (value == null) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((doc: Record<string, unknown>): void => {
      doc.toJSON = transformLocation;
    });
  }
  else {
    value.toJSON = transformLocation;
  }
});

/**
 * Compile the schema and export the model.
 */
export const _LocationModel = mongoose.model<_Location, LocationModelInterface>('Location', locationSchema);
