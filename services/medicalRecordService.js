// import MedicalRecord from '../models/MedicalRecordModel.js';
// import Vitals from '../models/vitalsModel.js';
// import Diagnosis from '../models/diagnosisModel.js';
// import AuditLog from '../models/auditLogModel.js';
// import logger from '../utils/logger.js';

// class MedicalRecordService {

//     /**
//      * Add a medical record with vitals and diagnosis
//      * @param {Object} data - contains patientId, doctorId, notes, vitalsData, diagnosisData
//      * @param {String} actor - who is performing this action
//      */
//     async addMedicalRecord(data, actor = 'staff') {
//         let session;
//         try {
//             // Start a MongoDB session for transaction
//             session = await MedicalRecord.startSession();
//             session.startTransaction();

//             // 1️⃣ Create the MedicalRecord
//             const medicalRecord = await MedicalRecord.create([{
//                 patientId: data.patientId,
//                 staffId: data.staffId,   // <-- updated
//                 notes: data.notes
//             }], { session });

//             const recordId = medicalRecord[0]._id;

//             // 2️⃣ Create Vitals documents
//             const vitals = await Vitals.insertMany(
//                 data.vitalsData.map(v => ({ ...v, medicalRecordId: recordId })),
//                 { session }
//             );

//             // 3️⃣ Create Diagnosis documents
//             const diagnosis = await Diagnosis.insertMany(
//                 data.diagnosisData.map(d => ({ ...d, medicalRecordId: recordId })),
//                 { session }
//             );

//             // 4️⃣ Update MedicalRecord with references
//             medicalRecord[0].vitals = vitals.map(v => v._id);
//             medicalRecord[0].diagnosis = diagnosis.map(d => d._id);
//             await medicalRecord[0].save({ session });

//             // Commit the transaction
//             await session.commitTransaction();
//             session.endSession();

//             // 5️⃣ Audit log
//             await AuditLog.create({
//                 action: 'ADD_MEDICAL_RECORD',
//                 actor,
//                 success: true,
//                 details: { patientId: data.patientId, recordId }
//             });

//             logger.info(`Medical record added for patient ${data.patientId} by ${actor}`);
//             return medicalRecord[0];

//         } catch (err) {
//             if (session) {
//                 await session.abortTransaction();
//                 session.endSession();
//             }

//             // Audit log for failure
//             await AuditLog.create({
//                 action: 'ADD_MEDICAL_RECORD',
//                 actor,
//                 success: false,
//                 reason: err.message,
//                 details: { patientId: data.patientId }
//             });

//             logger.error(`Failed to add medical record for patient ${data.patientId}: ${err.message}`);
//             throw err;
//         }
//     }

//     // Get all medical records with details
//     async getAllMedicalRecords() {
//         const records = await MedicalRecord.find()
//             .populate('vitals')     // populate vitals array
//             .populate('diagnosis')  // populate diagnosis array
//             .populate({
//                 path: 'patientId',    // populate patient info
//                 select: 'fullName patientId dob sex phone email'
//             })
//             .sort({ visitDate: -1 }); // optional: latest first

//         logger.info('Fetched all medical records', { count: records.length });
//         return records;
//     }

//     // Get all records for a specific patient
//     async getRecordsByPatient(patientId) {
//         const records = await MedicalRecord.find({ patientId })
//             .populate('vitals')
//             .populate('diagnosis')
//             .populate({
//                 path: 'patientId',
//                 select: 'fullName patientId dob sex phone email'
//             })
//             .sort({ visitDate: -1 });

//         logger.info('Fetched medical records for patient', { patientId, count: records.length });
//         return records;
//     }
// }

// export default new MedicalRecordService();

import MedicalRecordRepository from '../repositories/medicalRecordRepository.js';
import { validateMedicalRecordInput } from '../validators/medicalRecordValidator.js';
import { logAudit } from '../utils/auditLogger.js';
import logger from '../utils/logger.js';
import MedicalRecord from '../models/MedicalRecordModel.js';

class MedicalRecordService {

  async addMedicalRecord(data, actor = 'staff') {
    let session;

    try {
      // ✅ Validation
      validateMedicalRecordInput(data);

      // ✅ Start transaction
      session = await MedicalRecord.startSession();
      session.startTransaction();

      const medicalRecord = await MedicalRecordRepository.createMedicalRecord({
        patientId: data.patientId,
        staffId: data.staffId,
        notes: data.notes
      }, session);

      const vitals = await MedicalRecordRepository.insertVitals(data.vitalsData, medicalRecord._id, session);
      const diagnosis = await MedicalRecordRepository.insertDiagnosis(data.diagnosisData, medicalRecord._id, session);

      medicalRecord.vitals = vitals.map(v => v._id);
      medicalRecord.diagnosis = diagnosis.map(d => d._id);
      await medicalRecord.save({ session });

      await session.commitTransaction();
      session.endSession();

      // ✅ Audit & Info logging
      await logAudit({
        action: 'ADD_MEDICAL_RECORD',
        actor,
        success: true,
        details: { patientId: data.patientId, recordId: medicalRecord._id }
      });

      logger.info(`Medical record added for patient ${data.patientId} by ${actor}`);
      return medicalRecord;

    } catch (err) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }

      await logAudit({
        action: 'ADD_MEDICAL_RECORD',
        actor,
        success: false,
        reason: err.message,
        details: { patientId: data?.patientId }
      });

      logger.error(`Failed to add medical record for patient ${data?.patientId}: ${err.message}`);
      throw err;
    }
  }

  async getAllMedicalRecords() {
    try {
      const records = await MedicalRecordRepository.findAllMedicalRecords();
      logger.info(`Fetched all medical records, total: ${records.length}`);
      return records;
    } catch (err) {
      logger.error(`Failed to fetch all medical records: ${err.message}`);
      throw err;
    }
  }

  async getRecordsByPatient(patientId) {
    try {
      const records = await MedicalRecordRepository.findRecordsByPatient(patientId);
      logger.info(`Fetched medical records for patient ${patientId}, total: ${records.length}`);
      return records;
    } catch (err) {
      logger.error(`Failed to fetch medical records for patient ${patientId}: ${err.message}`);
      throw err;
    }
  }
}

export default new MedicalRecordService();

