import mongoose from 'mongoose';

const MedicalHistorySchema = new mongoose.Schema({
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
  bloodGroup: { type: String }
}, { _id: false });

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  phoneticName: { type: String, index: true }, // for phonetic matching
  nicOrPassport: { type: String, required: true, index: true },
  dob: { type: Date, required: true, index: true },
  sex: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  emergencyContact: { name: String, phone: String },
  medicalHistory: MedicalHistorySchema,
  createdAt: { type: Date, default: Date.now },
  card: {
    qr: String,
    status: { type: String, enum: ['CREATED','PENDING'], default: 'CREATED' }
  }
});

export default mongoose.model('Patient', PatientSchema);
