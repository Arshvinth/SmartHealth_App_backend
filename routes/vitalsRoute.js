// routes/vitalsRoute.js
import express from 'express';
import VitalsController from '../controllers/vitalsController.js';

const router = express.Router();

// PUT /api/vitals/:vitalsId
router.put('/updateVitals/:vitalsId', VitalsController.updateVitals);

export default router;
