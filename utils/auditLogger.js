import AuditLog from '../models/auditLogModel.js';

// Logs audit events
export async function logAudit({ action, actor, success, details, reason }) {
  await AuditLog.create({ action, actor, success, details, reason });
}
