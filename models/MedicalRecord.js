import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    visitDate: {
        type: Date,
        default: Date.now
    },
    doctorId: {
        type: String,
        ref:'Staff'
    }, // Staff/Doctor who created record
    notes: {
        type: String,
        required: true
    }, // Required field
    vitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vitals'
    }],
    diagnosis: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diagnosis'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

MedicalRecordSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('MedicalRecord', MedicalRecordSchema);
