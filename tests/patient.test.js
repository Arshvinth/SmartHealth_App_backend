/**
 * Tests for patient registration critical paths.
 * Uses mongodb-memory-server to avoid external dependency.
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';
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
  await Patient.deleteMany({});
});

describe('Patient Registration API', () => {
  const base = '/api/patients';
  const validPayload = {
    fullName: 'John Doe',
    nicOrPassport: 'N1234567V',
    dob: '1990-01-01',
    sex: 'M',
    address: 'No. 1, Colombo',
    phone: '+94123456789',
    email: 'john@example.com',
    medicalHistory: { allergies: ['Peanuts'], chronicConditions: [], medications: [] }
  };

  test('successful registration returns 201 and patient object', async () => {
    const res = await request(app).post(`${base}/register`).send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.patient).toHaveProperty('patientId');
    expect(res.body.patient.fullName).toBe(validPayload.fullName);
  });

  test('duplicate by NIC+DOB returns 409', async () => {
    // create existing
    await request(app).post(`${base}/register`).send(validPayload);
    // attempt register same NIC & DOB but different name
    const res = await request(app).post(`${base}/register`).send({
      ...validPayload,
      fullName: 'Johnny D',
      email: 'jd@example.com'
    });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('candidate');
    expect(res.body.reason).toMatch(/NIC|DOB|match/i);
  });

  test('validation failure returns 400', async () => {
    const bad = { fullName: 'A', nicOrPassport: '', dob: 'bad-date' };
    const res = await request(app).post(`${base}/register`).send(bad);
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  test('check-duplicate endpoint returns duplicate info', async () => {
    await request(app).post(`${base}/register`).send(validPayload);
    const res = await request(app).post(`${base}/check-duplicate`).send({
      fullName: 'John Doe',
      nicOrPassport: validPayload.nicOrPassport,
      dob: validPayload.dob
    });
    expect(res.status).toBe(200);
    expect(res.body.isDuplicate).toBe(true);
  });
});
