import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        requires: true,

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