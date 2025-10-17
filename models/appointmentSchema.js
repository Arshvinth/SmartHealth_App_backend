import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        default: Date.now
    },
    charges: {
        type: Number,
        required: true
    },
    appointmentNumber: {
        type: Number,
        required: true
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
        required: true
    },
    patientInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }

    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "Insurance"],
        default: "Cash"
    },
    status: {
        type: String,
        enum: ["Scheduled", "Cancelled", "Completed"],
        default: "Scheduled"
    },
});

export default mongoose.model("Appointment", appointmentSchema);