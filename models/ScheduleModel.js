import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    scheduleId: {
        type: String,
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
    dayOfWeek: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    scheduleDate: {
        type: Date,
        default: Date.nows
    },
    startTime: {
        type: String,
        required: true
    },
    numberLimit: {
        type: Number,
        required: true
    },
    BookedCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

export default mongoose.model("Schedule", ScheduleSchema);