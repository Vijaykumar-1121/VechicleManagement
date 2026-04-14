const express = require('express');
const router = express.Router();
const { createInvoice, getMyInvoices, payInvoice, verifyPayment, createPaymentOrder, getAllInvoices } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('service_center', 'admin'), createInvoice);
router.get('/', protect, authorizeRoles('admin'), getAllInvoices);
router.get('/my', protect, getMyInvoices);
router.post('/:id/create-razorpay-order', protect, createPaymentOrder);
router.put('/:id/pay', protect, verifyPayment); // Verifies Razorpay signature
router.delete('/:id', protect, authorizeRoles('admin'), require('../controllers/invoiceController').deleteInvoice);

module.exports = router;
