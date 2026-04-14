const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Please add a vehicle registration number'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9- ]+$/i.test(v);
      },
      message: props => `${props.value} contains invalid characters!`
    }
  },
  model: {
    type: String,
    required: [true, 'Please add vehicle model'],
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    required: true,
  },
  purchaseYear: {
    type: Number,
    required: [true, 'Please add a purchase year'],
    min: [1950, 'Year must be greater than 1950'],
    max: [new Date().getFullYear() + 1, `Year cannot exceed ${new Date().getFullYear() + 1}`]
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
