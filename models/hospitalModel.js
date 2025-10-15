import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema({
    hospitalId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model("Hospital", hospitalSchema);