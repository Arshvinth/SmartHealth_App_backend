import * as patientService from '../services/patientService.js';
import { validatePatientPayload } from '../validators/patientValidator.js';
import AuditLog from '../models/auditLogModel.js';

export async function checkDuplicate(req, res, next) {
  try {
    const { fullName, nicOrPassport, dob } = req.body;
    const result = await patientService.findPotentialDuplicates({ fullName, nicOrPassport, dob });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const payload = req.body;
    // validation
    const errors = validatePatientPayload(payload);
    if (errors.length) {
      await AuditLog.create({ action: 'REGISTER_VALIDATE_FAIL', actor: 'self-register', success: false, reason: errors.join(';') });
      return res.status(400).json({ errors });
    }

    // run duplicate check again in service
    const dup = await patientService.findPotentialDuplicates(payload);
    if (dup.isDuplicate) {
      // audit and return conflict with masked candidate data (PII masking)
      const candidate = dup.candidate;
      await AuditLog.create({ action: 'REGISTER_DUPLICATE_DETECTED', actor: 'self-register', success: false, details: { reason: dup.reason } });
      return res.status(409).json({
        message: 'Potential duplicate found',
        reason: dup.reason,
        candidate: { patientId: candidate.patientId, fullName: candidate.fullName, dob: candidate.dob }
      });
    }

    const saved = await patientService.registerPatient(payload, 'self-register');
    return res.status(201).json({ patient: saved });
  } catch (err) {
    next(err);
  }
}

export async function getPatientByQr(req, res) {
    try {
        const qr = req.params.qr;
        const patient = await patientService.getPatientByQr(qr);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({ patient });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}