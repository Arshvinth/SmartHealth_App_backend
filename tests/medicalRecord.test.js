/**
 * Tests for Medical Record API endpoints.
 * Uses mongodb-memory-server to simulate a MongoDB.
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';               // Your Express app
import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await MedicalRecord.deleteMany({});
  await Patient.deleteMany({});
});

describe('Medical Record API', () => {
  const base = '/api/medicalRecords';

  let testPatient;

  beforeEach(async () => {
    // Create a dummy patient first
    testPatient = await Patient.create({
      patientId: 'PH-12345',
      fullName: 'John Test',
      dob: '1990-01-01',
      nicOrPassport: 'N9999999V',
      phone: '+94123456789',
      email: 'john@test.com'
    });
  });

  test('should create a new medical record', async () => {
    const payload = {
      patientId: testPatient._id,  // or testPatient.patientId depending on your schema
      diagnosis: 'Common Cold',
      treatment: 'Rest and fluids',
      doctor: 'Dr. Smith'
    };

    const res = await request(app).post(`${base}/add`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body.record).toHaveProperty('_id');
    expect(res.body.record.diagnosis).toBe('Common Cold');
  });

  test('should return 400 if missing required fields', async () => {
    const res = await request(app).post(`${base}/add`).send({});
    expect(res.status).toBe(400);
  });

  test('should get all medical records for a patient', async () => {
    // Add one record
    await MedicalRecord.create({
      patientId: testPatient._id,
      diagnosis: 'Flu',
      treatment: 'Medicine'
    });

    const res = await request(app).get(`${base}/${testPatient._id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.records)).toBe(true);
    expect(res.body.records.length).toBe(1);
  });
});
