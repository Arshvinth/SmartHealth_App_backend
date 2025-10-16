// Validator to ensure input data is correct
export function validateMedicalRecordInput(data) {
  if (!data.patientId) throw new Error('patientId is required');
  if (!data.staffId) throw new Error('staffId is required');
  if (!Array.isArray(data.vitalsData)) throw new Error('vitalsData must be an array');
  if (!Array.isArray(data.diagnosisData)) throw new Error('diagnosisData must be an array');
}
