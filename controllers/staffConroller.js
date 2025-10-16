//Comment

import StaffService from '../services/staffService.js';

class StaffController {
    async addStaff(req, res, next) {
        try {
            const staffData = req.body;
            const newStaff = await StaffService.createStaff(staffData);
            res.status(201).json(newStaff);
        } catch (err) {
            next(err);
        }
    }

    async getAllStaff(req, res, next) {
        try {
            const staffList = await StaffService.getAllStaff();
            res.status(200).json(staffList);
        } catch (err) {
            next(err);
        }
    }

    async getStaffById(req, res, next) {
        try {
            const { staffId } = req.params;
            const staff = await StaffService.getStaffById(staffId);
            res.status(200).json(staff);
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const staff = await StaffService.login(username, password);
            res.status(200).json({ success: true, staff });
        } catch (err) {
            res.status(401).json({ success: false, message: err.message });
        }
    }
}

export default new StaffController();
