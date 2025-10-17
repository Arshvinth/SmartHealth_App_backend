import AppointmentModel from "../models/appointmentSchema.js";
import ScheduleModel from "../models/ScheduleModel.js";
import scheduleService from "./scheduleService.js";

class AppointmentService {
    async createAppointment(patientId, doctorId, hospitalId, scheduleId, charges, patientInfo, paymentMethod) {
        console.log("Received ScheduleId:", scheduleId);
        const schedule = await ScheduleModel.findById(scheduleId);
        console.log("Schedule found:", schedule);

        //const patientId = "68efe6401c0f65de24140471";
        if (!schedule) {
            throw new Error("Schedule not Found");
        }

        if (!patientInfo || !patientInfo.name || !patientInfo.email || !patientInfo.phone) {
            throw new Error("Patient information (name, email, phone) is required");
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
            patientInfo,
            paymentMethod,
            status: "Completed"
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
        let appointments = await AppointmentModel.find({ patientId: userId })
            .populate("doctorId", "name specialization") // Only get specific fields
            .populate("hospitalId", "name address")
            .populate("scheduleId")
            .sort({ createdAt: -1 })
            .lean();

        console.log('📊 Query results with patientId:', appointments?.length || 0);
        if (!appointments || appointments.length === 0) {
            console.log('🔄 Trying with userId field...');
            appointments = await AppointmentModel.find({ userId: userId })
                .populate("doctorId", "name specialization")
                .populate("hospitalId", "name address")
                .populate("scheduleId")
                .sort({ createdAt: -1 })
                .lean();

            console.log('📊 Query results with userId:', appointments?.length || 0);
        }

        if (!appointments || appointments.length === 0) {
            console.log('ℹ️ No appointments found for user:', userId);
            return []; // Return empty array instead of throwing error
        }

        console.log('✅ Final appointments:', appointments);
        return appointments;
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