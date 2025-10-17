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

    async login(username, password) {
        const usernameTrimmed = username.trim();
        const passwordTrimmed = password.trim();

        const staff = await Staff.findOne({
            fullName: { $regex: new RegExp(`^${usernameTrimmed}$`, 'i') }
        }).select('+password');

        if (!staff || staff.password !== passwordTrimmed) {
            throw new Error('Invalid username or password');
        }

        staff.password = undefined; // hide before returning
        return staff;
    }

}

export default new StaffService();
