import app from "../server.js";
import request from "supertest";
import { setupTestDB, teardownTestDB } from "./setupTestDB.js";
import MedicalRecord from "../models/MedicalRecordModel.js";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("MedicalRecord API Integration Tests", () => {
  it("should create a new medical record", async () => {
    const payload = {
      patientId: "64f1234567890abcdef12345",
      staffId: "64f9876543210fedcba98765",
      notes: "Test note",
      vitalsData: [],
      diagnosisData: [],
    };

    const res = await request(app)
      .post("/api/medicalRecords/addMedicalRecord")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");

    const saved = await MedicalRecord.findById(res.body._id);
    expect(saved.notes).toBe("Test note");
  });
});
