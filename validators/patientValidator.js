import validator from "validator";

export function validatePatientPayload(payload = {}) {
  const errors = [];
  if (!payload.fullName || payload.fullName.trim().length < 3) {
    errors.push("fullName must be at least 3 characters");
  }
  if (!payload.nicOrPassport || !payload.nicOrPassport.trim()) {
    errors.push("NIC/Passport required");
  }
  const dobDate = new Date(payload.dob);
  if (!payload.dob || isNaN(dobDate.getTime())) {
    errors.push("Valid date of birth required");
  }

  if (payload.email && !validator.isEmail(payload.email)) {
    errors.push("Invalid email format");
  }
  if (payload.phone && !/^[+0-9\s-]{7,15}$/.test(payload.phone)) {
    errors.push("Invalid phone number");
  }

  return errors;
}
