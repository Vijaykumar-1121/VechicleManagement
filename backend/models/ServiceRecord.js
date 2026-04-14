const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  repairDetails: {
    type: String,
    required: true,
  },
  replacedParts: {
    type: [String],
    default: [],
  },
  serviceStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
