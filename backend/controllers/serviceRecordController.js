const ServiceRecord = require('../models/ServiceRecord');
const Appointment = require('../models/Appointment');

// @desc    Create new service record
// @route   POST /api/servicerecords
// @access  Private (Technician/Admin)
const createServiceRecord = async (req, res) => {
  try {
    const { vehicleId, appointmentId, repairDetails, replacedParts, serviceStatus } = req.body;

    const serviceRecord = await ServiceRecord.create({
      vehicleId,
      technicianId: req.user._id,
      appointmentId,
      repairDetails,
      replacedParts,
      serviceStatus: serviceStatus || 'Completed',
    });

    res.status(201).json(serviceRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service records for a vehicle
// @route   GET /api/servicerecords/vehicle/:vehicleId
// @access  Private
const getServiceRecordsByVehicle = async (req, res) => {
  try {
    const records = await ServiceRecord.find({ vehicleId: req.params.vehicleId })
      .populate('technicianId', 'name')
      .populate('appointmentId');
      
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get service record for a specific appointment
// @route   GET /api/servicerecords/appointment/:appointmentId
// @access  Private (Admin/Staff)
const getServiceRecordByAppointment = async (req, res) => {
  try {
    const record = await ServiceRecord.findOne({ appointmentId: req.params.appointmentId })
      .populate('technicianId', 'name');
      
    if (!record) {
      return res.status(404).json({ message: 'Service record not found for this appointment' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createServiceRecord,
  getServiceRecordsByVehicle,
  getServiceRecordByAppointment,
};
