// services/patientService.js
import Patient from "../models/patientModel.js";
import AuditLog from "../models/auditLogModel.js";
import { metaphoneKey } from "../utils/phonetic.js";
import { generatePatientId } from "../utils/idGenerator.js";
import levenshtein from "fast-levenshtein";

/**
 * Check for potential duplicate patients.
 */
export async function findPotentialDuplicates({
  fullName,
  nicOrPassport,
  dob,
}) {
  // Convert dob to date range to avoid time zone mismatches
  // Defensive DOB parsing
  const inputDob = new Date(dob);
  if (isNaN(inputDob.getTime())) {
    throw new Error("Invalid date of birth");
  }

  const startOfDay = new Date(inputDob);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(inputDob);
  endOfDay.setHours(23, 59, 59, 999);

  // Exact match NIC + DOB (by day)
  const exact = await Patient.findOne({
    nicOrPassport,
    dob: { $gte: startOfDay, $lte: endOfDay },
  }).lean();

  if (exact) {
    return { isDuplicate: true, reason: "NIC+DOB match", candidate: exact };
  }

  // Phonetic + similarity match
  const key = metaphoneKey(fullName);
  const candidates = await Patient.find({ phoneticName: key }).limit(10).lean();

  for (const c of candidates) {
    const dist = levenshtein.get(
      (c.fullName || "").toLowerCase(),
      fullName.toLowerCase()
    );
    const len = Math.max((c.fullName || "").length, fullName.length);
    const sim = 1 - dist / Math.max(len, 1);
    if (sim >= 0.7) {
      return {
        isDuplicate: true,
        reason: "Phonetic+name-similarity",
        candidate: c,
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Register a new patient.
 */
export async function registerPatient(payload, actor = "self-register") {
  const audit = { action: "REGISTER_PATIENT", actor, success: false };
  try {
    // Phonetic name index
    const phoneticName = metaphoneKey(payload.fullName);

    // Generate patient ID
    const patientId = generatePatientId();

    // ALWAYS enforce valid status
    const validCardStatus = ["Active", "Inactive"];
    const cardStatus = validCardStatus.includes(payload.card?.status)
      ? payload.card.status
      : "Active";

    const patient = new Patient({
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
      card: {
        qr: `QR:${patientId}`,
        status: cardStatus, // ✅ guaranteed valid
      },
      createdAt: new Date(),
    });

    const saved = await patient.save();

    // Audit log
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


