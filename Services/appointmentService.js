import appointmentSchema from "../models/appointmentSchema.js";
import ScheduleModel from "../models/ScheduleModel.js";
import scheduleService from "./scheduleService.js";

class AppointmentService {
    async createAppointment(userId, doctorId, hospitalId, ScheduleId, charges) {
        const schedule = await ScheduleModel.findById(ScheduleId);

        if (!schedule) {
            throw new Error("Schedule not Found");
        }

        await scheduleService.increaseBooking(ScheduleId);

        const currentDate = new Date();

        const appointmentNumber = schedule.BookedCount;

        const appointmentTime = currentDate.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const appointmentDate = currentDate.toISOString().split('T')[0];

        const appointment = new appointmentSchema({
            userId,
            doctorId,
            hospitalId,
            appointmentDate,
            appointmentTime,
            charges,
            appointmentNumber,
            ScheduleId
        });

        await appointment.save();
        return appointment;



    }

    async cancelAppointment(appointmentId) {
        const appointment = await appointmentSchema.findById(appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }

        appointment.status = "Cancelled";

        await appointment.save();

        await scheduleService.decreasingBooking(appointment.scheduleId)
        return appointment;
    }

    async getUserAppointments(userId) {
        return appointmentSchema.find({ userId })
            .populate("doctorId")
            .populate("hospitalId")
            .populate("scheduleId")
            .sort({ createdAt: -1 });
    }



}

export default new AppointmentService();