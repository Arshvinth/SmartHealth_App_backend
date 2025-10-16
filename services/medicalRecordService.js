import MedicalRecordRepository from '../repositories/medicalRecordRepository.js';
import { validateMedicalRecordInput } from '../validators/medicalRecordValidator.js';
import { logAudit } from '../utils/auditLogger.js';
import logger from '../utils/logger.js';
import MedicalRecord from '../models/MedicalRecordModel.js';

/**
 * Business logic separated from controllers - single responsibility.
 */

class MedicalRecordService {

  async addMedicalRecord(data, actor = 'staff') {
    let session;

    try {
      // Validation
      validateMedicalRecordInput(data);

      // Start transaction
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

      // Audit & Info logging
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

