import express from 'express';
import * as locations from '../controllers/locations';
import * as other from '../controllers/others';

// Create a router
export const _router = express.Router();

// GET home page
_router.get('/', locations._locationsList);

// GET details page
_router.get('/location', locations._locationInfo);

// GET add review page
_router.get('/location/review/new', locations._newReview);

// Get about page
_router.get('/about', other._about);
