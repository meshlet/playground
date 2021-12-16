import mongoose from 'mongoose';

/**
 * Typescript interface describing opening hours type.
 *
 * @note If given location has different opening hours at different
 * days, an array of these would be created.
 */
interface OpeningHours {
  days: string,
  opening?: string,
  closing?: string,
  closed: boolean
}

/**
 * Opening hours mongoose schema.
 *
 * TODO: implement opening/closing hour as a `number of minutes since midnight`
 */
const openingHoursSchema = new mongoose.Schema<OpeningHours, mongoose.Model<OpeningHours>>({
  days: {
    type: String,
    required: true,
    minlength: 1
  },
  opening: String,
  closing: String,
  closed: {
    type: Boolean,
    required: true
  }
});

/**
 * Typescript interface describing a single review.
 */
interface Review {
  reviewer: string,
  createdOn?: Date,
  rating: number,
  text: string
}

/**
 * Review mongoose schema.
 */
const reviewSchema = new mongoose.Schema<Review, mongoose.Model<Review>>({
  reviewer: {
    type: String,
    required: true,
    minlength: 1
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true,
    minlength: 1
  }
});

/**
 * Typescript interface describing a single GeoJSON point.
 */
interface GeoPoint {
  type: string,
  coordinates: [number, number]
}

/**
 * GeoJSON point schema.
 *
 * This defines the structure of a GeoJSON point. MongoDB supports geospatial
 * queries on GeoJSON objects with this structure.
 */
const geoPointSchema = new mongoose.Schema<GeoPoint, mongoose.Model<GeoPoint>>({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    // TODO: add custom validator here that checks array has the length of 2 (longitude
    //  and latitude), the first element (longitude) is between -180 and 180 and the
    //  second element (latitude) is between -90 and 90 (as required by the GeoJSON
    //  spec.
    type: [Number],
    required: true
  }
});

/**
 * Typescript interface describing a single location.
 */
export interface _Location {
  name: string,
  rating?: number,
  address: string,
  facilities?: mongoose.Types.Array<string>,
  coords: GeoPoint,
  openingHours: mongoose.Types.DocumentArray<OpeningHours>,
  reviews?: mongoose.Types.DocumentArray<Review>
}

/**
 * Location schema defines structure and validation rules for a single
 * location.
 *
 * TODO: rating must be calculated as an average of ratings from all the reviews
 */
const locationSchema = new mongoose.Schema<_Location, mongoose.Model<_Location>>({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  address: {
    type: String,
    required: true,
    minlength: 1
  },
  facilities: {
    type: [String],
    default: []
  },
  coords: {
    type: geoPointSchema,
    required: true,
    // Create a 2dsphere index on the coords path in order to speed-up geospatial
    // queries on this path.
    index: '2dsphere'
  },
  openingHours: {
    // TODO: validate that array has at least one element
    type: [openingHoursSchema],
    required: true
  },
  reviews: {
    type: [reviewSchema],
    default: []
  }
});

/**
 * Compile the schema into the location model
 */
export const _LocationModel = mongoose.model<_Location>('Location', locationSchema);
