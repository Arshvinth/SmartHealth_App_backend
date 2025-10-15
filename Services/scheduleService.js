import ScheduleModel from "../models/ScheduleModel.js";

class ScheduleService {
    async decreasingBooking(scheduleId) {
        const schedule = await ScheduleModel.findById(scheduleId);
        if (schedule && schedule.BookedCount > 0) {
            schedule.BookedCount -= 1;
            await schedule.save();
        }
    }

    async increaseBooking(scheduleId) {
        const schedule = await ScheduleModel.findById(scheduleId);
        if (!schedule) {
            throw new Error("Schedule not found");
        }
        if (schedule.BookedCount >= schedule.numberLimit) {
            throw new Error("Session Full");
        }

        schedule.BookedCount += 1;
        await schedule.save();

    }

    async getScheduleAvailability(scheduleId) {
        const schedule = await ScheduleModel.find(scheduleId);
        if (!schedule) {
            throw new Error("Schedule Not Found");
        }

        const available = schedule.numberLimit - schedule.BookedCount > 0 ? schedule.numberLimit - schedule.BookedCount : 0;

        return {
            scheduleId,
            available,
            isFull: schedule.BookedCount >= schedule.numberLimit
        };

    }

    async getSchedules(doctorsId, hospitalsId) {
        const schedules = await ScheduleModel.find({
            doctorId: doctorsId,
            hospitalId: hospitalsId
        });

        return schedules;
    }

}

export default new ScheduleService();