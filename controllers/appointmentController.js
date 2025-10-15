import appointmentService from "../Services/appointmentService";

export const scheduleAppointment = async (req, res) => {
    try {
        const { userId, doctorId, hospitalId, ScheduleId, charges } = req.body;
        const appointment = await appointmentService.createAppointment(
            userId,
            doctorId,
            hospitalId,
            ScheduleId,
            charges
        );

        res.status(201).json({
            success: true,
            message: "Appointment Added SuccessFully",
            appointmentNumber: appointment.appointmentNumber,
            appointment
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

};