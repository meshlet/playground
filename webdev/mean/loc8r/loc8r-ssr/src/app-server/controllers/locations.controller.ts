import { URLSearchParams } from 'url';
import { Request, Response } from 'express-serve-static-core';
import {
  Environment,
  GetLocationsRspI,
  GetOneLocationRspI,
  RestErrorI,
  isRecord
} from '../../common/common.module';
import {
  _restGet as restGet,
  _restPostUrlEnc as restPostUrlEnc,
  _processRestResponse as processRestResponse
} from '../misc/rest-client';
import {
  _HttpRspErrorRender as HttpRspErrorRender,
  _HttpRspErrorRedirect as HttpRspErrorRedirect
} from '../misc/http-rsp-error';
import { _ViewLocalsBaseI as ViewLocalsBaseI } from '../misc/view-locals-base';
import { _renderView as renderView } from '../misc/render-view';

/**
 * Contains controllers for the views in the locations group: home page
 * (lists locations), details page (shows one location details) and add
 * new review page (allows adding a review for the selected location).
 *
 * @todo Add function that maps route to view name.
 */

/**
 * View locals expected by the locations-list view.
 */
interface LocationsListLocalsT extends ViewLocalsBaseI {
  sidebar: string;
  pageHeader: {
    title: string,
    tagline: string
  };
  locations: GetLocationsRspI['locations'];
}

/**
 * Fetches locations and renders them.
 *
 * @note `activeMenuItem` property is used to decide whether to
 * add the `active` Bootstrap class to <a> element in the navigation
 * bar.
 */
export async function _locationsList(_: Request, res: Response<string>) {
  /** @todo Longitude, latitude, maxDistance and maxLocations parameters must be passed in from the client. */
  const searchParams = new URLSearchParams();
  searchParams.append('longitude', '10.380589298808665');
  searchParams.append('latitude', '63.41638573651207');
  searchParams.append('maxDistance', '10000');

  // Read locations from the rest API server
  const restApiRes = await restGet('locations', searchParams);

  processRestResponse(
    restApiRes,
    'GetLocations',
    (restRspBody: GetLocationsRspI) => {
      const viewLocals: LocationsListLocalsT = {
        title: 'Loc8r - Find places with wifi!',
        activeMenuItem: 0,
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to' +
          ' work when out and about. Perhaps with coffee, cake or a pint?' +
          ' Let Loc8r help you find the place you\'re looking for.',
        pageHeader: {
          title: 'Loc8r',
          tagline: 'Find places to work with WiFi near you!'
        },
        locations: restRspBody.locations
      };
      renderView(res, 'locations-list', viewLocals);
    },
    (error: RestErrorI) => {
      throw new HttpRspErrorRedirect(
        restApiRes.statusCode >= 500 ? '/error' : '/',
        restApiRes.statusCode >= 500
          ? 'Failed to obtain venues data due to an internal server error.'
          : error.message);
    });
}

/**
 * @todo Add docs.
 */
interface LocationInfoLocalsI extends ViewLocalsBaseI {
  sidebar: {
    context: string,
    callToAction: string
  };
  location: GetOneLocationRspI['location'];
  mapParams: {
    apiKey: string,
    size: string,
    zoom: number,
    scale: number
  };
}

/**
 * Fetches single location and renders it.
 */
export async function _locationInfo(req: Request, res: Response<string>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new HttpRspErrorRedirect(
      '/error',
      'Failed to navigate to the venue page due to an internal server error.');
  }

  // Fetch location from the REST server
  const restApiRes = await restGet(`locations/${req.params.locationid}`);

  processRestResponse(
    restApiRes,
    'GetOneLocation',
    (restRspBody: GetOneLocationRspI) => {
      const viewLocals: LocationInfoLocalsI = {
        title: `Loc8r - ${restRspBody.location.name}`,
        activeMenuItem: -1,
        /** @todo Context text should actually be a short description field in the location itself. */
        sidebar: {
          context: ' is on Loc8r because it has quality wifi' +
            ' and space to sit down with your laptop and get some work done.',
          callToAction: 'If you\'ve been and you like it - or if you don\'t -' +
            ' please leave a review to help people just like you.'
        },
        mapParams: {
          apiKey: Environment.GOOGLE_MAPS_API_KEY,
          size: '400x350',
          zoom: 17,
          scale: 2
        },
        location: restRspBody.location
      };
      renderView(res, 'location-info', viewLocals);
    },
    (error: RestErrorI) => {
      throw new HttpRspErrorRedirect(
        restApiRes.statusCode >= 500 ? '/error' : '/',
        restApiRes.statusCode >= 500
          ? 'Failed to obtain venue data due to an internal server error.'
          : error.message);
    });
}

interface NewReviewPageLocalsI extends ViewLocalsBaseI {
  locationId: string;
  locationName: string;
}

/**
 * A controller that renders the new review page.
 */
export function _getNewReviewPage(req: Request, res: Response<string>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new HttpRspErrorRedirect(
      '/error',
      'Failed to navigate to the new review page due to an internal server error.');
  }
  if (typeof req.query.name !== 'string' || req.query.name.trim() === '') {
    throw new HttpRspErrorRedirect(
      '/',
      'Failed to navigate to the new review page due to malformed data received from the user agent.');
  }

  const viewLocals: NewReviewPageLocalsI = {
    title: `Loc8r - Review ${req.query.name}`,
    activeMenuItem: -1,
    locationId: req.params.locationid,
    locationName: req.query.name
  };

  // Render the view
  renderView(res, 'add-review', viewLocals);
}

interface PostNewReviewLocalsI extends NewReviewPageLocalsI {
  locationId: string;
  locationName: string;
  reviewer: string;
  rating: string;
  text: string;
}

/**
 * A controller that attempts to add a new review for the given location.
 */
export async function _postNewReview(req: Request, res: Response<string>) {
  if (!req.params.locationid) {
    // It is a programming error to call this controller for a route without
    // the locationid parameter
    throw new HttpRspErrorRedirect(
      '/error',
      'Unable to create a new review due to an internal server error.');
  }
  if (typeof req.query.name !== 'string' || req.query.name.trim() === '') {
    throw new HttpRspErrorRedirect(
      '/',
      'Unable to create a new review due to malformed data received from the user agent.');
  }
  if (!isRecord(req.body)) {
    throw new HttpRspErrorRedirect(
      '/',
      'Unable to create a new review due to malformed data received from the user agent.');
  }

  const viewLocals: PostNewReviewLocalsI = {
    title: `Review ${req.params.locationid}`,
    activeMenuItem: -1,
    locationId: req.params.locationid,
    locationName: req.query.name,
    reviewer: '',
    rating: '',
    text: ''
  };
  if (typeof req.body.reviewer === 'string' &&
      typeof req.body.rating === 'string' &&
      typeof req.body.text === 'string') {
    const body = new URLSearchParams();
    body.append('reviewer', req.body.reviewer);
    body.append('rating', req.body.rating);
    body.append('text', req.body.text);

    // Post review to the REST server
    const restApiRes = await restPostUrlEnc(
      `locations/${req.params.locationid}/reviews`,
      body);

    // Defined here because TypeScript forgots the typeof type checks done
    // above in the processRestResponse's error callback.
    viewLocals.reviewer = req.body.reviewer;
    viewLocals.rating = req.body.rating;
    viewLocals.text = req.body.text;

    processRestResponse(
      restApiRes,
      'CreateReview',
      () => {
        // Redirect to location's page
        req.flash('info', 'Successfully added a new review.');
        res.status(302).redirect(`/locations/${req.params.locationid}`);
      },
      (error: RestErrorI) => {
        if (restApiRes.statusCode < 500) {
          throw new HttpRspErrorRender(
            restApiRes.statusCode,
            'add-review',
            viewLocals,
            error
          );
        }
        else {
          // Unexpected REST API internal server error
          throw new HttpRspErrorRedirect(
            '/error',
            'Unable to create a new review due to an internal server error.');
        }
      });
  }
  else {
    // Report validation errors without contacting the REST server
    // as mandatory data is missing from the request's body.
    const error: RestErrorI = {
      message: 'Review could not be created due to malformed data.'
    };
    error.validationErr = {};
    if (req.body.reviewer == null) {
      error.validationErr.reviewer = 'Reviewer name must be provided.';
    }
    if (req.body.rating == null) {
      error.validationErr.rating = 'Rating must be provided.';
    }
    if (req.body.text == null) {
      error.validationErr.text = 'Review text must be provided.';
    }
    throw new HttpRspErrorRender(
      400,
      'add-review',
      viewLocals,
      error);
  }
}
