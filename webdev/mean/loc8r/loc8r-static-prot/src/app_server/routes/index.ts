import express from 'express';
import * as locations from '../controllers/locations';
import * as other from '../controllers/others';

// Create a router
export const router = express.Router();

// GET home page
router.get('/', locations.home);

// GET details page
router.get('/location', locations.details);

// GET add review page
router.get('/location/review/new', locations.newReview);

// Get about page
router.get('/about', other.about);
