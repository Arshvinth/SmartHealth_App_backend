import scheduleService from "../Services/scheduleService.js";

export const checkAvailability = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const availability = await scheduleService.getScheduleAvailability(scheduleId);

        res.json({
            success: true,
            message: "Check Availability success",
            availability
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const getSchedules = async (req, res) => {

    try {
        const { hospitalId, doctorId } = req.params;
        const availability = await scheduleService.getSchedules(doctorId, hospitalId);

        res.json({
            success: true,
            message: "Check Availability success",
            availability
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}