import MedicalRecordService from '../services/medicalRecordService.js';

class MedicalRecordController {

  async createMedicalRecord(req, res, next) {
    try {
      const actor = req.body.actor || 'staff';
      const record = await MedicalRecordService.addMedicalRecord(req.body, actor);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }

  async getAllMedicalRecords(req, res, next) {
    try {
      const records = await MedicalRecordService.getAllMedicalRecords();
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  }

  async getRecordsByPatient(req, res, next) {
    try {
      const { patientId } = req.params;
      const records = await MedicalRecordService.getRecordsByPatient(patientId);
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  }
//   async getRecordsByPatient(req, res, next) {
//   try {
//     const { patientId } = req.params;
//     // Populate vitals and diagnosis
//     const records = await MedicalRecord.find({ patientId })
//       .populate('vitals')       // Populate vitals collection
//       .populate('diagnosis');   // Populate diagnosis collection
//     res.status(200).json(records);
//   } catch (err) {
//     next(err);
//   }
// }
}

export default new MedicalRecordController();
