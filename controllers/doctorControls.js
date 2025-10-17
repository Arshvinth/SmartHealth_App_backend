import doctorService from "../Services/doctorService.js"

export const getDoctors = async (req, res) => {
    console.log("GET /doctorsList route hit");
    try {
        console.log("Fetching doctors from service...");
        const doctors = await doctorService.getDoctorDetails();
        console.log("Doctors found:", doctors.length);
        res.status(200).json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error("Error in getDoctors:", error);
        res.status(400).json({
            success: false,
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

// For specialization report
export const getDoctorSpecilizationReport = async (req, res) => {
  try {
    const specializationStats = await doctorService.getDoctorSpecializationSummary();
    res.status(200).json({
      success: true,
      message: "Doctor specialization summary fetched successfully",
      data: specializationStats,
    });
  } catch (error) {
    console.error("Error fetching specialization summary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};