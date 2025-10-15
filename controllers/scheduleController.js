import scheduleService from "../Services/scheduleService";

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