/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {}, // No Babel needed, native ESM
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setupTestDB.js"],
  testTimeout: 30000
};
