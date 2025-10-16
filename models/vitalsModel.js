import mongoose from 'mongoose';

const VitalsSchema = new mongoose.Schema({
    medicalRecordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
    },
    bloodPressure: {
        type: String
    }, // e.g., "120/80"
    heartRate: {
        type: Number
    },     // bpm
    temperature: {
        type: Number
    },   // °C
    weight: {
        type: Number
    },        // kg
    height: {
        type: Number
    },        // cm
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Vitals', VitalsSchema);
