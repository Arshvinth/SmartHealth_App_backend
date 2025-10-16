import express from 'express';
import StaffController from '../controllers/staffConroller.js';

const router = express.Router();

// Add a new staff
router.post('/addStaff', StaffController.addStaff);

// Get all staff
router.get('/allStaff', StaffController.getAllStaff);

// Get staff by staffId
router.get('/getOneStaff/:staffId', StaffController.getStaffById);

export default router;
