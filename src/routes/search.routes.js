import express from 'express';
import { searchVideos, searchChannels } from '../controllers/search.controllers.js';

const searchRoutes = express.Router();

// Search videos
searchRoutes.get('/videos', searchVideos);

// Search channels
searchRoutes.get('/channels', searchChannels);

export default searchRoutes;