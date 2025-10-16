import express from 'express';
import MedicalRecordController from '../controllers/medicalRecordController.js';

const router = express.Router();

// POST /medical-records
router.post('/addMedicalRecord', MedicalRecordController.createMedicalRecord);
router.get('/patientMedicalRecords/:patientId', MedicalRecordController.getRecordsByPatient);
router.get('/allMedicalRecords', MedicalRecordController.getAllMedicalRecords);

export default router;
