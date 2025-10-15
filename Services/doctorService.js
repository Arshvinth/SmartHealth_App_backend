import chargesModel from "../models/chargesModel.js";
import doctorModel from "../models/doctorModel.js";

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

    async getDoctorSpecilization() {
        const doctoSpecilize = await doctorModel.schema.path('specialization').enumValues;
        return doctoSpecilize;
    }




}

export default new DoctorService();