import MedicalRecord from '../models/MedicalRecordModel.js';
import Vitals from '../models/vitalsModel.js';
import Diagnosis from '../models/diagnosisModel.js';

// Handles all direct DB operations
class MedicalRecordRepository {

  async createMedicalRecord(data, session) {
    const [record] = await MedicalRecord.create([data], { session });
    return record;
  }

  async insertVitals(vitalsData, recordId, session) {
    if (!vitalsData.length) return [];
    return Vitals.insertMany(vitalsData.map(v => ({ ...v, medicalRecordId: recordId })), { session });
  }

  async insertDiagnosis(diagnosisData, recordId, session) {
    if (!diagnosisData.length) return [];
    return Diagnosis.insertMany(diagnosisData.map(d => ({ ...d, medicalRecordId: recordId })), { session });
  }

  async findAllMedicalRecords() {
    return MedicalRecord.find()
      .populate('vitals')
      .populate('diagnosis')
      .populate({ path: 'patientId', select: 'fullName patientId dob sex phone email' })
      .sort({ visitDate: -1 });
  }

  async findRecordsByPatient(patientId) {
    return MedicalRecord.find({ patientId })
      .populate('vitals')
      .populate('diagnosis')
      .populate({ path: 'patientId', select: 'fullName patientId dob sex phone email' })
      .sort({ visitDate: -1 });
  }
}

export default new MedicalRecordRepository();
