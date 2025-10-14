import validator from 'validator';

export function validatePatientPayload(payload = {}) {
  const errors = [];
  if (!payload.fullName || payload.fullName.trim().length < 3) {
    errors.push('fullName must be at least 3 characters');
  }
  if (!payload.nicOrPassport || !payload.nicOrPassport.trim()) {
    errors.push('NIC/Passport required');
  }
  if (!payload.dob || Number.isNaN(Date.parse(payload.dob))) {
    errors.push('Valid date of birth required');
  }
  if (payload.email && !validator.isEmail(payload.email)) {
    errors.push('Invalid email format');
  }
  if (payload.phone && !validator.isMobilePhone(payload.phone + '', 'any')) {
    errors.push('Invalid phone number');
  }
  return errors;
}
