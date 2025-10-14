import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Doctor", "Nurse", "Receptionist", "Manager"],
    required: true,
  },
  department: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false, // hide from query results by default
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Staff", StaffSchema);
