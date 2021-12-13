import { Location, LocationModel } from '../app_server/models/locations';
import mongoose from 'mongoose';

/**
 * An array whose each element corresponds to a specific DB collection. For
 * each collection, it's mongoose model is provided along with an array of
 * documents to be inserted to the DB.
 *
 * @note In case additional collections need to be added, extend the type
 * of the testData array with additional element and provide the data to
 * be inserted (for example, Array<Location | User>).
 */
export const testData: Array<
  {
    model: mongoose.Model<Location>,
    documents: Array<Location>
  }> = [
    {
      model: LocationModel,
      documents: [
        {
          name: 'Super Hero Burger',
          rating: 4,
          address: 'Olav Tryggvasons Gate 1, Trondheim',
          // TS is complaining due to missing mongoose.Types.Array properties
          // @ts-ignore
          facilities: [
            'Burgers',
            'Beverages',
            'Premium Wifi'
          ],
          coords: {
            type: 'Point',
            coordinates: [
              10.403175215780372,
              63.433582313276275
            ]
          },
          // TS is complaining due to missing mongoose.Types.DocumentArray properties
          // @ts-ignore
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
          // TS is complaining due to missing mongoose.Types.DocumentArray properties
          // @ts-ignore
          reviews: [
            {
              reviewer: 'John Doe',
              createdOn: new Date('2019-07-05'),
              rating: 4,
              text: 'A super nice place to grab something to eat and get some programming done!'
            },
            {
              reviewer: 'Mac Smith',
              createdOn: new Date('2020-12-02'),
              rating: 4,
              text: 'Very nice place to eat and chill but a bit too noisy to get work done IMHO.'
            },
            {
              reviewer: 'Jack Clark',
              createdOn: new Date('2021-06-04'),
              rating: 4,
              text: 'Awesome place! I recommend it for anyone looking to grab something to each and get stuff done in peace.'
            }
          ]
        },
        {
          name: 'Grano Trondheim',
          rating: 3,
          address: 'Søndre Gate 25, Trondheim',
          // TS is complaining due to missing mongoose.Types.Array properties
          // @ts-ignore
          facilities: [
            'Pizza',
            'Beverages',
            'Premium Wifi'
          ],
          coords: {
            type: 'Point',
            coordinates: [
              10.400563350309195,
              63.43423107645711
            ]
          },
          // TS is complaining due to missing mongoose.Types.DocumentArray properties
          // @ts-ignore
          openingHours: [
            {
              days: 'Monday - Saturday',
              opening: '11AM',
              closing: '10PM',
              closed: false
            },
            {
              days: 'Sunday',
              opening: '1PM',
              closing: '10PM',
              closed: false
            }
          ],
          // TS is complaining due to missing mongoose.Types.DocumentArray properties
          // @ts-ignore
          reviews: [
            {
              reviewer: 'Paul Webster',
              createdOn: new Date('2018-10-21'),
              rating: 4,
              text: 'One of the best pizza I ever had. So cross and juicy it’s unbelievable. Every bite is better than the one before. You feel like you are in Italy and the atmosphere is also very authentic. Do definitely recommended to come here, I will definitely come back a couple of times. 5 stars!'
            },
            {
              reviewer: 'Belma McNeal',
              createdOn: new Date('2019-01-09'),
              rating: 2,
              text: 'Excellent Italian pizza! The best pizza in Trondheim for sure. The menu has been refreshed. The tiramisu and the panna cotta were great! Recommended!'
            },
            {
              reviewer: 'Tom Chaney',
              createdOn: new Date('2017-04-23'),
              rating: 4,
              text: "I didn't know that pizza can taste and look so good! I still can't believe that it can reach this level. And the focaccia is on par with it!"
            },
            {
              reviewer: 'Johnny Donney',
              createdOn: new Date('2020-02-16'),
              rating: 2,
              text: 'Very nice pizza! Coming back here for sure :)'
            }
          ]
        },
        {
          name: 'Frati restaurant',
          rating: 4,
          address: 'Kongens gate 20, 7011 Trondheim',
          // TS is complaining due to missing mongoose.Types.Array properties
          // @ts-ignore
          facilities: [
            'Various Food',
            'Plenty Beverages',
            'Dedicated Workrooms',
            'Premium Wifi'
          ],
          coords: {
            type: 'Point',
            coordinates: [
              10.39368875570901,
              63.43090466799468
            ]
          },
          // TS is complaining due to missing mongoose.Types.DocumentArray properties
          // @ts-ignore
          openingHours: [
            {
              days: 'Monday - Thursday',
              opening: '11AM',
              closing: '10PM',
              closed: false
            },
            {
              days: 'Friday - Saturday',
              opening: '11AM',
              closing: '12PM',
              closed: false
            },
            {
              days: 'Sunday',
              closed: true
            }
          ],
          // TS is complaining due to missing mongoose.Types.DocumentArray properties
          // @ts-ignore
          reviews: [
            {
              reviewer: 'Mike Taylor',
              createdOn: new Date('2021-05-19'),
              rating: 4,
              text: 'Super good experience at Frati. Charming staff, good food and superb atmosphere. They craft øx beer in the “basement”. Enjoy a good time and don’t miss it if you’re visiting Trondheim!'
            },
            {
              reviewer: 'Amit Hakimi',
              createdOn: new Date('2019-01-09'),
              rating: 5,
              text: 'Lovely Italian restaurant, tasty pasta and very good service too. Was there three weeks ago, might visit again. Recommended!'
            },
            {
              reviewer: 'Nicolas Cage',
              createdOn: new Date('2020-02-29'),
              rating: 3,
              text: 'We arrived around noon, the restaurant was almost full and unfortunately there was nobody at the front desk so we chose to take a seat on the terrace. The Italian waiter greeted and seated us at a table. After we ordered I was curious about the location so like every new restaurant I check out …I had to go the bathroom.'
            },
            {
              reviewer: 'Mazla Alami',
              createdOn: new Date('2020-08-16'),
              rating: 4,
              text: "Had one of the best pizza's here in Norway. The staff was very friendly and the atmosphere was nice. The place is well-visited (which is totally understandable)! Would deff recommend coming here if you’re into pizza's."
            }
          ]
        }]
    }
  ];
