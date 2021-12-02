import { Request, Response } from 'express';

/**
 * Contains controllers for the views in the locations group: home page
 * (lists locations), details page (shows one location details) and add
 * new review page (allows adding a review for the selected location).
 */

/**
 * Home page controller.
 */
export function home(req: Request, res: Response): void {
  // `page` property is used to decide whether to add the `active` Bootstrap class
  // to <a> element in the navigation bar.
  res.render('locations-list', { title: 'Home', page: 'home' });
}

/**
 * Details page controller.
 */
export function details(req: Request, res: Response): void {
  res.render('location-info', { title: 'Location Info', page: 'details' });
}

/**
 * New review page controller.
 */
export function newReview(req: Request, res: Response): void {
  res.render('add-review', { title: 'Add review', page: 'add_review' });
}
