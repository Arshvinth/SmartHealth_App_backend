import mongoose from "mongoose";

const chargesSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    hospitalCharge: {
        type: Number,
        required: true
    },
    doctorCharge: {
        type: Number,
        required: true
    }
})

export default mongoose.model("Charges", chargesSchema);