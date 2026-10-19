const express = require('express');
const router = express.Router();

const {
  getAllPlaces,
  getPlacesForMap,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  buildItinerary,
} = require('../controllers/placeController');

const { requireAdmin } = require('../middleware/auth');
const { placeImageUpload } = require('../middleware/upload');

// Public (Tourist) routes
router.get('/', getAllPlaces);
router.get('/map', getPlacesForMap);
router.post('/itinerary', buildItinerary);
router.get('/:id', getPlaceById);

// Admin-only routes 
router.post('/', requireAdmin, placeImageUpload, createPlace);
router.put('/:id', requireAdmin, placeImageUpload, updatePlace);
router.delete('/:id', requireAdmin, deletePlace);

module.exports = router;
