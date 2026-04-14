const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles for a user
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private
const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, model, fuelType, purchaseYear } = req.body;

    const vehicleExists = await Vehicle.findOne({ vehicleNumber });
    if (vehicleExists) {
      return res.status(400).json({ message: 'Vehicle already exists' });
    }

    const vehicle = await Vehicle.create({
      userId: req.user._id,
      vehicleNumber,
      model,
      fuelType,
      purchaseYear,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  addVehicle,
};
