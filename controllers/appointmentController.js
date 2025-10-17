import appointmentService from "../Services/appointmentService.js";

export const scheduleAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, hospitalId, scheduleId, charges, patientInfo, paymentMethod } = req.body;
        const appointment = await appointmentService.createAppointment(
            patientId,
            doctorId,
            hospitalId,
            scheduleId,
            charges,
            patientInfo,
            paymentMethod
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
        console.log("Appointment details found - Starting to fetch...");
        const { userId } = req.params;
        console.log("User ID received:", userId);

        if (!userId || userId === 'undefined') {
            throw new Error("User ID is required");
        }

        console.log("Calling appointmentService.getUserAppointments...");
        const appointments = await appointmentService.getUserAppointments(userId);


        console.log("Appointments retrieved:", {
            count: appointments?.length || 0,
            data: appointments
        });

        res.json({
            success: true,
            appointments: appointments || []
        });
    } catch (error) {
        console.log("Appointment details not found");
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}