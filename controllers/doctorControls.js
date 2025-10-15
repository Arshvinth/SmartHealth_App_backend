import doctorService from "../Services/doctorService.js"

export const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorService.getDoctorDetails();
        res.status(200).json({
            success: true,
            doctors
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            message: error.message
        });
    }

}

export const getDoctorHospitals = async (req, res) => {

    try {
        const { doctorId } = req.params;

        const details = await doctorService.getDoctorHospitals(doctorId);
        res.status(200).json({
            success: true,
            details
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getDoctorSpecilization = async (req, res) => {

    try {

        const details = await doctorService.getDoctorSpecilization();
        res.status(200).json({
            success: true,
            details
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};