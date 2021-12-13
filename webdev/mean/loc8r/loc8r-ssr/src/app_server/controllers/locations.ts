import { Request, Response } from 'express';
import { GOOGLE_MAPS_API_KEY } from '../../env-parser';

/**
 * Contains controllers for the views in the locations group: home page
 * (lists locations), details page (shows one location details) and add
 * new review page (allows adding a review for the selected location).
 */

/**
 * Home page controller.
 */
export function locationsList(req: Request, res: Response): void {
  // `page` property is used to decide whether to add the `active` Bootstrap class
  // to <a> element in the navigation bar.
  res.render('locations-list', {
    title: 'Loc8r - Find places with wifi!',
    activeMenuItem: 0,
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to' +
      ' work when out and about. Perhaps with coffee, cake or a pint?' +
      ' Let Loc8r help you find the place you\'re looking for.',
    pageHeader: {
      title: 'Loc8r',
      tagline: 'Find places to work with WiFi near you!'
    },
    locations: [
      {
        name: 'Super Hero Burger',
        rating: 2,
        distance: '100m',
        address: 'Olav Tryggvasons Gate 1, Trondheim',
        facilities: [
          'Burgers',
          'Beverages',
          'Premium Wifi'
        ]
      },
      {
        name: 'Grano Trondheim',
        rating: 3,
        distance: '500m',
        address: 'Søndre Gate 25, Trondheim',
        facilities: [
          'Pizza',
          'Beverages',
          'Premium Wifi'
        ]
      },
      {
        name: 'Frati Restaurant',
        rating: 5,
        distance: '1km',
        address: 'Kongens gate 20, Trondheim',
        facilities: [
          'Various food',
          'Plenty beverages',
          'Dedicated workrooms',
          'Premium WiFi'
        ]
      }
    ]
  });
}

/**
 * Details page controller.
 */
export function locationInfo(req: Request, res: Response): void {
  res.render('location-info', {
    title: 'Loc8r - Super Hero Burger',
    activeMenuItem: -1,
    pageHeader: {
      title: 'Super Hero Burger'
    },
    sidebar: {
      context: ' is on Loc8r because it has quality wifi' +
        ' and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t -' +
        ' please leave a review to help people just like you.'
    },
    location: {
      name: 'Super Hero Burger',
      rating: 4,
      distance: '100m',
      address: 'Olav Tryggvasons Gate 1, Trondheim',
      openingHours: [
        {
          days: 'Monday - Wednesday',
          opening: '11AM',
          closing: '11PM',
          closed: false
        },
        {
          days: 'Thursday - Saturday',
          opening: '11AM',
          closing: '3:30AM',
          closed: false
        },
        {
          days: 'Sunday',
          closed: true
        }
      ],
      facilities: [
        'Burgers',
        'Beverages',
        'Premium Wifi'
      ],
      mapParams: {
        apiKey: GOOGLE_MAPS_API_KEY,
        coordinates: '63.433582313276275, 10.403175215780372',
        imgSize: '400x350',
        zoom: 17,
        scale: 2
      },
      reviews: [
        {
          reviewer: 'John Doe',
          date: '6th July, 2019',
          rating: 4,
          text: 'A super nice place to grab something to eat and get some programming done!'
        },
        {
          reviewer: 'Mac Smith',
          date: '3rd December, 2020',
          rating: 3,
          text: 'Very nice place to eat and chill but a bit too noisy to get work done IMHO.'
        }
      ]
    }
  });
}

/**
 * New review page controller.
 */
export function newReview(req: Request, res: Response): void {
  res.render('add-review', {
    title: 'Add review',
    activeMenuItem: -1,
    pageHeader: {
      title: 'Super Hero Burger'
    }
  });
}
