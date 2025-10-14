import AuditLog from '../models/auditLogModel.js';

export async function auditMiddleware(req, res, next) {
  // minimal audit stub for each incoming request (logged asynchronously)
  const rec = {
    action: `${req.method} ${req.path}`,
    actor: req.headers['x-actor'] || 'unknown',
    success: false,
    details: { body: req.body ? Object.keys(req.body) : undefined }
  };
  // create and store a reference to update after response
  const doc = await AuditLog.create(rec);
  // attach id to req so controllers can update if needed (not required)
  req.auditId = doc._id;
  // note: we don't await update here to keep performance
  res.on('finish', async () => {
    try {
      await AuditLog.findByIdAndUpdate(doc._id, { success: res.statusCode < 400 });
    } catch (err) {
      console.error('Failed to update audit log', err);
    }
  });
  next();
}
