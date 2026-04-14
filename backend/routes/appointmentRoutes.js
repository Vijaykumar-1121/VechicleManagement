const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getMyAppointments, 
  getAllAppointments, 
  updateAppointmentStatus,
  assignTechnician,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, createAppointment)
  .get(protect, authorizeRoles('technician', 'admin', 'service_center'), getAllAppointments);

router.get('/my', protect, getMyAppointments);

router.put('/:id/status', protect, authorizeRoles('technician', 'admin', 'service_center'), updateAppointmentStatus);
router.put('/:id/assign', protect, authorizeRoles('admin', 'service_center'), assignTechnician);
router.delete('/:id', protect, authorizeRoles('admin'), deleteAppointment);

module.exports = router;
