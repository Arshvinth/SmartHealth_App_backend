import express from 'express';
import { checkDuplicate, register, getPatientByQr  } from '../controllers/patientController.js';

const router = express.Router();

/**
 * POST /api/patients/check-duplicate
 * body: { fullName, nicOrPassport, dob }
 */
router.post('/check-duplicate', checkDuplicate);

/**
 * POST /api/patients/register
 * body: registration payload
 */
router.post('/register', register);

router.get('/qr/:qr', getPatientByQr);


export default router;
