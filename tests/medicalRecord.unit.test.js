// tests/medicalRecord.unit.test.js
import { jest } from '@jest/globals';
import MedicalRecordRepository from '../repositories/medicalRecordRepository.js';
import MedicalRecord from '../models/MedicalRecordModel.js';
import Vitals from '../models/vitalsModel.js';
import Diagnosis from '../models/diagnosisModel.js';

// Manually mock Mongoose static methods
MedicalRecord.find = jest.fn();
MedicalRecord.create = jest.fn();
Vitals.insertMany = jest.fn();
Diagnosis.insertMany = jest.fn();

describe('MedicalRecordRepository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMedicalRecord', () => {
    it('should create a medical record', async () => {
      const mockData = { patientId: '123' };
      const mockRecord = { ...mockData, _id: '1' };

      MedicalRecord.create.mockResolvedValue([mockRecord]);

      const result = await MedicalRecordRepository.createMedicalRecord(mockData);

      expect(MedicalRecord.create).toHaveBeenCalledWith([mockData], { session: undefined });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('insertVitals', () => {
    it('should insert vitals', async () => {
      const vitalsData = [{ type: 'BP', value: '120/80' }];
      const recordId = '1';
      const mockVitals = vitalsData.map(v => ({ ...v, medicalRecordId: recordId }));

      Vitals.insertMany.mockResolvedValue(mockVitals);

      const result = await MedicalRecordRepository.insertVitals(vitalsData, recordId);

      expect(Vitals.insertMany).toHaveBeenCalledWith(mockVitals, { session: undefined });
      expect(result).toEqual(mockVitals);
    });

    it('should return empty array if no vitals', async () => {
      const result = await MedicalRecordRepository.insertVitals([], '1');
      expect(result).toEqual([]);
      expect(Vitals.insertMany).not.toHaveBeenCalled();
    });
  });

  describe('insertDiagnosis', () => {
    it('should insert diagnosis', async () => {
      const diagnosisData = [{ name: 'Flu' }];
      const recordId = '1';
      const mockDiagnosis = diagnosisData.map(d => ({ ...d, medicalRecordId: recordId }));

      Diagnosis.insertMany.mockResolvedValue(mockDiagnosis);

      const result = await MedicalRecordRepository.insertDiagnosis(diagnosisData, recordId);

      expect(Diagnosis.insertMany).toHaveBeenCalledWith(mockDiagnosis, { session: undefined });
      expect(result).toEqual(mockDiagnosis);
    });

    it('should return empty array if no diagnosis', async () => {
      const result = await MedicalRecordRepository.insertDiagnosis([], '1');
      expect(result).toEqual([]);
      expect(Diagnosis.insertMany).not.toHaveBeenCalled();
    });
  });

  describe('findAllMedicalRecords', () => {
    it('should return all medical records with populate', async () => {
      const mockRecords = [{ _id: '1' }];
      const populateMock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue(mockRecords) };
      MedicalRecord.find.mockReturnValue(populateMock);

      const result = await MedicalRecordRepository.findAllMedicalRecords();

      expect(MedicalRecord.find).toHaveBeenCalled();
      expect(populateMock.populate).toHaveBeenCalledTimes(3); // vitals, diagnosis, patientId
      expect(populateMock.sort).toHaveBeenCalledWith({ visitDate: -1 });
      expect(result).toEqual(mockRecords);
    });
  });

  describe('findRecordsByPatient', () => {
    it('should return patient records with populate', async () => {
      const patientId = '123';
      const mockRecords = [{ _id: '1', patientId }];
      const populateMock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue(mockRecords) };
      MedicalRecord.find.mockReturnValue(populateMock);

      const result = await MedicalRecordRepository.findRecordsByPatient(patientId);

      expect(MedicalRecord.find).toHaveBeenCalledWith({ patientId });
      expect(populateMock.populate).toHaveBeenCalledTimes(3);
      expect(populateMock.sort).toHaveBeenCalledWith({ visitDate: -1 });
      expect(result).toEqual(mockRecords);
    });
  });
});
