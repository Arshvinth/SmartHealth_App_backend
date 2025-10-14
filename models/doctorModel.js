import mongoose from "mongoose";

const doctorModel = new mongoose.Schema({
    doctorId: {
        type: String,
        required: true
    },
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
    }


}, { timestamps:true});

export default mongoose.model('Doctor', doctorModel);