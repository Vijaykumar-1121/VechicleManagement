const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  lineItems: [{
    description: { type: String, required: true },
    cost: { type: Number, required: true }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Invoice must have a total amount'],
    min: [1, 'Amount must be greater than 0']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
