import mongoose from 'mongoose';

const DiagnosisSchema = new mongoose.Schema({
    medicalRecordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
    },
    diagnosis: {
        type: String,
        required: true
    }, // Text summary of diagnosis
    condition: {
        type: String,
        required: true
    }, // Specific condition name
    medication: {
        type: [String],
        default: []
    }, // Prescribed meds
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Diagnosis', DiagnosisSchema);