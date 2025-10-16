import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actor: { type: String }, // e.g., 'self-register' or staff id
  success: { type: Boolean, default: false },
  reason: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', AuditLogSchema);
