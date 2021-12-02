import { Request, Response } from 'express';

/**
 * Contains controllers for views that don't fit into any other group.
 */

/**
 * About page controller.
 */
export function about(req: Request, res: Response): void {
  res.render('about', { title: 'About', page: 'about' });
}
