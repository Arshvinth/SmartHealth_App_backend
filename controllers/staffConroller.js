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
}

export default new StaffController();
