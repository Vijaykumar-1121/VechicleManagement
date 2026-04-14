const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getVehicles)
  .post(protect, addVehicle);

module.exports = router;
