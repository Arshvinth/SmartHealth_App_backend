/**
 * Tests for MedicalRecord API endpoints.
 * Uses mongodb-memory-server to simulate a MongoDB instance.
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../server.js'; // Your Express app
import MedicalRecord from '../models/MedicalRecordModel.js';
import Patient from '../models/patientModel.js'; // Assuming you have a Patient model

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('MedicalRecord API', () => {

  let patientId;

  beforeEach(async () => {
    // Create a dummy patient
    const patient = await Patient.create({
      fullName: 'John Doe',
      nicOrPassport: 'N1234567V',
      dob: '1990-01-01',
      sex: 'M',
      address: 'No. 1, Colombo',
      phone: '+94123456789',
      email: 'john@example.com',
      medicalHistory: { allergies: ['Peanuts'], chronicConditions: [], medications: [] }
    });
    patientId = patient._id;
    console.log("PATEITENT", patientId)
  });

  describe('POST /addMedicalRecord', () => {
    it('should create a new medical record successfully', async () => {
      const payload = {
        patientId,
        staffId: 'staff123',
        notes: 'Patient visit for routine checkup',
        vitalsData: [
          { type: 'Blood Pressure', value: '120/80' },
          { type: 'Heart Rate', value: '75' }
        ],
        diagnosisData: [
          { condition: 'Healthy', severity: 'None' }
        ]
      };

      const res = await request(app)
        .post('/medical-records/addMedicalRecord')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.patientId).toBe(patientId.toString());
      expect(res.body.notes).toBe(payload.notes);
      expect(res.body.vitals.length).toBe(2);
      expect(res.body.diagnosis.length).toBe(1);

      // Check in DB
      const recordInDb = await MedicalRecord.findById(res.body._id);
      expect(recordInDb).not.toBeNull();
    });

    it('should fail if required fields are missing', async () => {
      const payload = {
        staffId: 'staff123',
        notes: 'Missing patientId'
      };

      const res = await request(app)
        .post('/medical-records/addMedicalRecord')
        .send(payload);

      expect(res.status).toBe(400); // Assuming validation throws 400
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/patientId/i);
    });

    it('should log audit and rollback on failure', async () => {
      // Passing invalid vitalsData (simulate failure)
      const payload = {
        patientId,
        staffId: 'staff123',
        notes: 'Test invalid vitals',
        vitalsData: null // invalid
      };

      const res = await request(app)
        .post('/medical-records/addMedicalRecord')
        .send(payload);

      expect(res.status).toBe(400);
      // DB should not have created any record
      const records = await MedicalRecord.find();
      expect(records.length).toBe(0);
    });
  });

});
