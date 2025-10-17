import mongoose from "mongoose";

const doctorModel = new mongoose.Schema({

    profileImage:
    {
        url: { type: String, required: true },
        public_id: { type: String, required: true },

    },

    name: {
        type: String,
        required: true,

    },
    specialization: {
        type: String,
        enum: [
            "Paediatrician",
            "Dermatologist",
            "Family Physician",
            "Mental Health Professionals",
            "Physician",
            "Obstetrician and Gynaecologist",
            "Cosmetic Gynecology",
            "Orthopaedic Surgeon",
            "Dietitians & Nutritionists",
            "Physiotherapist",
            "Clinical Embryoogist",
            "Cardiologist",
            "Gastroenterologist",
            "Pulmonologist",
            "ENT Surgeon",
            "Nephrologist",
            "Oncologist"
        ],
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    experience: {
        type: Number
    },
    bio: {
        type: String
    },
    doctorKeyId: {
        type: String,
        required: true
    }


}, { timestamps: true });

export default mongoose.model("Doctor", doctorModel);
