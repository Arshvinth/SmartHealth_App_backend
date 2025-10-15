import appointmentService from "../Services/appointmentService.js";

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

export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await appointmentService.cancelAppointment(appointmentId);

        console.log("Appointment Cancel");

        res.json({
            success: true,
            message: "Appointment Cancelled Successfully",
            appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const getUserAppointments = async (req, res) => {
    try {
        console.log("Appointment details found");
        const { userId } = req.params;
        const appointment = await appointmentService.getUserAppointments(userId);

        console.log("Appointment:", appointment);

        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.log("Appointment details not found");
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}