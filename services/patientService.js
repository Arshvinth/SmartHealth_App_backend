import Patient from '../models/patientModel.js';
import AuditLog from '../models/auditLogModel.js';
import { metaphoneKey } from '../utils/phonetic.js';
import { generatePatientId } from '../utils/idGenerator.js';
import levenshtein from 'fast-levenshtein';

/**
 * Business logic separated from controllers - single responsibility.
 */

export async function findPotentialDuplicates({ fullName, nicOrPassport, dob }) {
  // Exact match NIC + DOB priority
  const exact = await Patient.findOne({
    nicOrPassport,
    dob: new Date(dob)
  }).lean();
  if (exact) {
    return { isDuplicate: true, reason: 'NIC+DOB match', candidate: exact };
  }

  // Phonetic: compute key and search by phoneticName + dob near match
  const key = metaphoneKey(fullName);
  const candidates = await Patient.find({ phoneticName: key }).limit(10).lean();
  // compute string distance on names to filter
  for (const c of candidates) {
    const dist = levenshtein.get((c.fullName || '').toLowerCase(), fullName.toLowerCase());
    const len = Math.max((c.fullName || '').length, fullName.length);
    const sim = 1 - dist / Math.max(len, 1);
    if (sim >= 0.7) { // threshold for likely match
      return { isDuplicate: true, reason: 'Phonetic+name-similarity', candidate: c };
    }
  }
  return { isDuplicate: false };
}

export async function registerPatient(payload, actor = 'self-register') {
  const audit = { action: 'REGISTER_PATIENT', actor, success: false };
  try {
    // Phonetic index
    const phoneticName = metaphoneKey(payload.fullName);
    // Generate ID
    const patientId = generatePatientId();

    const p = new Patient({
      patientId,
      fullName: payload.fullName,
      phoneticName,
      nicOrPassport: payload.nicOrPassport,
      dob: new Date(payload.dob),
      sex: payload.sex,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      emergencyContact: payload.emergencyContact,
      medicalHistory: payload.medicalHistory,
      card: { qr: `QR:${patientId}`, status: 'CREATED' }
    });

    const saved = await p.save();
    audit.success = true;
    audit.details = { patientId: saved.patientId };
    await AuditLog.create(audit);
    return saved.toObject();
  } catch (err) {
    audit.reason = err.message;
    await AuditLog.create(audit);
    throw err;
  }
}

/**
 * Fetch patient by QR code
 * @param {string} qr
 * @returns patient object or null
 */
export async function getPatientByQr(qr) {
    return await Patient.findOne({ 'card.qr': qr }).lean();
}


