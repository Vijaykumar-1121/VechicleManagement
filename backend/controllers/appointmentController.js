const Appointment = require('../models/Appointment');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { vehicleId, serviceType, appointmentDate } = req.body;

    const appointment = await Appointment.create({
      vehicleId,
      serviceType,
      appointmentDate,
      status: 'Booked',
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate({
      path: 'vehicleId',
      match: { userId: req.user._id },
    });

    // Filter out appointments where vehicleId is null (meaning it didn't match the user)
    const userAppointments = appointments.filter((app) => app.vehicleId !== null);
    
    res.json(userAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active appointments (for technicians/admins)
// @route   GET /api/appointments
// @access  Private
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('vehicleId')
      .populate('technicianId', 'name')
      .sort({ appointmentDate: 1 }); // Sort by soonest first
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    
    // Return populated
    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate('vehicleId')
      .populate('technicianId', 'name');
      
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign technician to appointment
// @route   PUT /api/appointments/:id/assign
// @access  Private (Service Center / Admin)
const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.technicianId = technicianId;
    await appointment.save();
    
    // Return populated
    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate('vehicleId')
      .populate('technicianId', 'name');
      
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();
    res.json({ id: req.params.id, message: 'Appointment deleted strictly' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  assignTechnician,
  deleteAppointment
};
