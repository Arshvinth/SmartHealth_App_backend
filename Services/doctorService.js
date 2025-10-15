import chargesModel from "../models/chargesModel";
import doctorModel from "../models/doctorModel";

class DoctorService {

    async getDoctorDetails() {
        const doctorDetails = await doctorModel.find();

        return doctorDetails;
    }

    async getDoctorHospitals(doctorId) {
        const details = await chargesModel.find({ doctorId })
            .populate("hospitalId")
            .select("hospitalId name branch");

        return details;
    }
}

export default new DoctorService();