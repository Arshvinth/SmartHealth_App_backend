import ScheduleModel from "../models/ScheduleModel";

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

}

export default new ScheduleService();