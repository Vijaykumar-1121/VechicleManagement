const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Booked', 'In Progress', 'Awaiting Invoice', 'Completed', 'Cancelled'],
    default: 'Booked',
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing User because technicians authenticate through User model
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
