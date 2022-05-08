import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  LocationI,
  GetLocationsRspI,
  GetOneLocationRspI,
  GetOneReviewRspI,
  CreateReviewRspI,
  ReviewI
} from 'loc8r-common/common.module';
import { BaseDataSource } from './base.datasource';
import { FrontendError, ErrorCode } from '../misc/error';

/**
 * A static data source useful for development and testing.
 */
@Injectable()
export class StaticDataSource implements BaseDataSource {
  private idCounter = 0;
  public data: Array<LocationI>;

  constructor() {
    this.data = [
      {
        _id: this.getNextId(),
        name: 'Super Hero Burger',
        rating: 4,
        address: 'Olav Tryggvasons Gate 1, Trondheim',
        facilities: ['Burgers', 'Beverages', 'Premium Wifi'],
        distance: 1240.233422,
        coords: {
          longitude: 10.403175215780372,
          latitude: 63.433582313276275
        },
        openingHours: [
          {
            dayRange: 'Monday - Wednesday',
            opening: '11:00 a.m.',
            closing: '11:00 p.m.',
            closed: false
          },
          {
            dayRange: 'Thursday - Saturday',
            opening: '11:00 a.m.',
            closing: '3:30 a.m.',
            closed: false
          },
          {
            dayRange: 'Sunday',
            closed: true
          }
        ],
        reviews: [
          {
            reviewer: 'John Doe',
            createdOn: '2019-07-05T00:00:00.000Z',
            rating: 5,
            text: 'A super nice place to grab something to eat and get some programming done!',
            _id: this.getNextId()
          },
          {
            reviewer: 'Mac Smith',
            createdOn: '2020-12-02T00:00:00.000Z',
            rating: 3,
            text: 'Very nice place to eat and chill but a bit too noisy to get work done IMHO.',
            _id: this.getNextId()
          },
          {
            reviewer: 'Jack Clark',
            createdOn: '2021-06-04T00:00:00.000Z',
            rating: 4,
            text: 'Awesome place! I recommend it for anyone looking to grab something to each and get stuff done in peace.',
            _id: this.getNextId()
          }
        ]
      },
      {
        _id: this.getNextId(),
        name: 'Grano Trondheim',
        rating: 3.25,
        address: 'Søndre Gate 25, Trondheim',
        facilities: ['Pizza', 'Beverages', 'Premium Wifi'],
        distance: 2342.2343423,
        coords: {
          longitude: 10.400563350309195,
          latitude: 63.43423107645711
        },
        openingHours: [
          {
            dayRange: 'Monday - Saturday',
            opening: '11:00 a.m.',
            closing: '10:00 p.m.',
            closed: false
          },
          {
            dayRange: 'Sunday',
            opening: '1:00 p.m.',
            closing: '10:00 p.m.',
            closed: false
          }
        ],
        reviews: [
          {
            reviewer: 'Paul Webster',
            createdOn: '2018-10-21T00:00:00.000Z',
            rating: 4,
            text: 'One of the best pizza I ever had. So cross and juicy it’s unbelievable. Every bite is better than the one before. You feel like you are in Italy and the atmosphere is also very authentic. Do definitely recommended to come here, I will definitely come back a couple of times. 5 stars!',
            _id: this.getNextId()
          },
          {
            reviewer: 'Belma McNeal',
            createdOn: '2019-01-09T00:00:00.000Z',
            rating: 3,
            text: 'Excellent Italian pizza! The best pizza in Trondheim for sure. The menu has been refreshed. The tiramisu and the panna cotta were great! Recommended!',
            _id: this.getNextId()
          },
          {
            reviewer: 'Tom Chaney',
            createdOn: '2017-04-23T00:00:00.000Z',
            rating: 4,
            text: "I didn't know that pizza can taste and look so good! I still can't believe that it can reach this level. And the focaccia is on par with it!",
            _id: this.getNextId()
          },
          {
            reviewer: 'Johnny Donney',
            createdOn: '2020-02-16T00:00:00.000Z',
            rating: 2,
            text: 'Very nice pizza! Coming back here for sure :)',
            _id: this.getNextId()
          }
        ]
      },
      {
        _id: this.getNextId(),
        name: 'Frati restaurant',
        rating: 4.25,
        address: 'Kongens gate 20, 7011 Trondheim',
        facilities: [
          'Various Food',
          'Plenty Beverages',
          'Dedicated Workrooms',
          'Premium Wifi'
        ],
        distance: 3589.3423423234,
        coords: {
          longitude: 10.39368875570901,
          latitude: 63.43090466799468
        },
        openingHours: [
          {
            dayRange: 'Monday - Thursday',
            opening: '11:00 a.m.',
            closing: '10:00 p.m.',
            closed: false
          },
          {
            dayRange: 'Friday - Saturday',
            opening: '11:00 a.m.',
            closing: '12:00 a.m.',
            closed: false
          },
          {
            dayRange: 'Sunday',
            closed: true
          }
        ],
        reviews: [
          {
            reviewer: 'Mike Taylor',
            createdOn: '2021-05-19T00:00:00.000Z',
            rating: 5,
            text: 'Super good experience at Frati. Charming staff, good food and superb atmosphere. They craft øx beer in the “basement”. Enjoy a good time and don’t miss it if you’re visiting Trondheim!',
            _id: this.getNextId()
          },
          {
            reviewer: 'Amit Hakimi',
            createdOn: '2019-01-09T00:00:00.000Z',
            rating: 5,
            text: 'Lovely Italian restaurant, tasty pasta and very good service too. Was there three weeks ago, might visit again. Recommended!',
            _id: this.getNextId()
          },
          {
            reviewer: 'Nicolas Cage',
            createdOn: '2020-02-29T00:00:00.000Z',
            rating: 3,
            text: 'We arrived around noon, the restaurant was almost full and unfortunately there was nobody at the front desk so we chose to take a seat on the terrace. The Italian waiter greeted and seated us at a table. After we ordered I was curious about the location so like every new restaurant I check out …I had to go the bathroom.',
            _id: this.getNextId()
          },
          {
            reviewer: 'Mazla Alami',
            createdOn: '2020-08-16T00:00:00.000Z',
            rating: 4,
            text: "Had one of the best pizza's here in Norway. The staff was very friendly and the atmosphere was nice. The place is well-visited (which is totally understandable)! Would deff recommend coming here if you’re into pizza's.",
            _id: this.getNextId()
          }
        ]
      }
    ];
  }

  private getNextId() {
    return (this.idCounter++).toString();
  }

  getLocations(longitude: number, latitude: number, maxDistance: number): Observable<GetLocationsRspI['locations']> {
    void longitude;
    void latitude;
    void maxDistance;
    return from([this.data]);
  }

  getOneLocation(locationid: string): Observable<GetOneLocationRspI['location']> {
    return new Observable(subscriber => {
      // Find the location with the given ID
      const location = this.data.find((value: LocationI) => value._id === locationid);

      if (location) {
        subscriber.next(location);
        subscriber.complete();
      }
      else {
        subscriber.error(new FrontendError(ErrorCode.ResourceNotFound));
      }
    });
  }

  getOneReview(locationid: string, reviewid: string): Observable<GetOneReviewRspI['review']> {
    return new Observable(subscriber => {
      // Find the location with the given ID
      const location = this.data.find(value => value._id === locationid);

      if (!location) {
        return subscriber.error(new FrontendError(ErrorCode.ResourceNotFound));
      }

      // Find the review
      const review = location.reviews.find(value => value._id === reviewid);
      if (!review) {
        return subscriber.error(new FrontendError(ErrorCode.ResourceNotFound));
      }

      subscriber.next(review);
      subscriber.complete();
    });
  }

  createReview(locationid: string, review: ReviewI): Observable<CreateReviewRspI['review']> {
    return new Observable(subscriber => {
      // Find the location with the given ID
      const location = this.data.find(value => value._id === locationid);

      if (!location) {
        return subscriber.error(new FrontendError(ErrorCode.ResourceNotFound));
      }

      // Add the new review
      review._id = this.getNextId();
      review.createdOn = (new Date(Date.now())).toISOString();
      location.reviews.push({
        _id: review._id,
        createdOn: review.createdOn,
        reviewer: review.reviewer,
        rating: review.rating,
        text: review.text
      });

      // Update the location rating
      location.rating = location.reviews.reduce((acc, currentValue) => {
        return acc + currentValue.rating;
      }, 0) / location.reviews.length;

      subscriber.next(review);
      subscriber.complete();
    });
  }
}
