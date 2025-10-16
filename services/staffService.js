import Staff from '../models/StaffModel.js';
import logger from '../utils/logger.js';

class StaffService {
  async createStaff(data) {
    try {
      const staff = await Staff.create(data);
      logger.info(`Staff ${data.fullName} added successfully`);
      return staff;
    } catch (err) {
      logger.error(`Failed to add staff: ${err.message}`);
      throw err;
    }
  }

  async getAllStaff() {
    try {
      return await Staff.find().select('-password'); // hide passwords
    } catch (err) {
      throw err;
    }
  }

  async getStaffById(staffId) {
    try {
      const staff = await Staff.findOne({ staffId }).select('-password');
      if (!staff) throw new Error('Staff not found');
      return staff;
    } catch (err) {
      throw err;
    }
  }
}

export default new StaffService();
