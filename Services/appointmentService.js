import AppointmentModel from "../models/appointmentSchema.js";
import ScheduleModel from "../models/ScheduleModel.js";
import scheduleService from "./scheduleService.js";

class AppointmentService {
    async createAppointment(patientId, doctorId, hospitalId, scheduleId, charges) {
        console.log("Received ScheduleId:", scheduleId);
        const schedule = await ScheduleModel.findById(scheduleId);
        console.log("Schedule found:", schedule);

        if (!schedule) {
            throw new Error("Schedule not Found");
        }

        await scheduleService.increaseBooking(scheduleId);

        const currentDate = new Date();

        const appointmentNumber = schedule.BookedCount;

        const appointmentTime = currentDate.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const appointmentDate = currentDate.toISOString().split('T')[0];

        const appointment = new AppointmentModel({
            patientId,
            doctorId,
            hospitalId,
            appointmentDate,
            appointmentTime,
            charges,
            appointmentNumber,
            scheduleId,
            status: "Scheduled"
        });

        await appointment.save();
        return appointment;



    }

    async cancelAppointment(appointmentId) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }

        appointment.status = "Cancelled";

        await appointment.save();

        await scheduleService.decreasingBooking(appointment.scheduleId)
        return appointment;
    }

    async getUserAppointments(userId) {
        return AppointmentModel.find({ userId })
            .populate("doctorId")
            .populate("hospitalId")
            .populate("scheduleId")
            .sort({ createdAt: -1 });
    }

    async markAsCompleted(appointmentId) {
        const appointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { status: "Completed" },
            { new: true });

        if (!appointment) {
            throw new Error("Appointment  not found");
        }

        return appointment;
    }


}

export default new AppointmentService();