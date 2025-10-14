import { v4 as uuidv4 } from 'uuid';

export function generatePatientId() {
  // deterministic readable id - prefix + uuid short
  return `PH-${uuidv4().split('-')[0].toUpperCase()}`;
}
