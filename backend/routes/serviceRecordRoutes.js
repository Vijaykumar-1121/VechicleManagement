const express = require('express');
const router = express.Router();
const { createServiceRecord, getServiceRecordsByVehicle, getServiceRecordByAppointment } = require('../controllers/serviceRecordController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('technician', 'admin', 'service_center'), createServiceRecord);
router.get('/vehicle/:vehicleId', protect, getServiceRecordsByVehicle);
router.get('/appointment/:appointmentId', protect, authorizeRoles('admin', 'service_center'), getServiceRecordByAppointment);

module.exports = router;
