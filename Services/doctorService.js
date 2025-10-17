import mongoose from "mongoose";
import chargesModel from "../models/chargesModel.js";
import doctorModel from "../models/doctorModel.js";
import hospital from "../models/hospital.js";


class DoctorService {

    async getDoctorDetails() {
        console.log("Querying database for doctors...");
        const doctorDetails = await doctorModel.find();
        console.log("Database result:", doctorDetails);
        return doctorDetails;
    }


    async getDoctorHospitals(doctorId) {
        try {
            // Validate doctorId
            if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
                throw new Error('Valid doctor ID is required');
            }

            // Get charges with hospital population
            const charges = await chargesModel.find({ doctorId })
                .populate("hospitalId")
                .select("hospitalId hospitalCharge doctorCharge");

            // Transform the data
            const hospitals = charges.map(charge => {
                const hospital = charge.hospitalId;
                return {
                    id: hospital._id, // Use _id instead of hospitalId
                    name: hospital.name,
                    branch: hospital.branch,
                    phone: hospital.phone,
                    email: hospital.email,
                    hospitalKeyId: hospital.hospitalKeyId,
                    hospitalCharge: charge.hospitalCharge,
                    doctorCharge: charge.doctorCharge,
                    totalCharge: charge.hospitalCharge + charge.doctorCharge
                };
            });

            return hospitals;
        } catch (error) {
            console.error('Error in getDoctorHospitals:', error);
            throw error;
        }
    }

    async getDoctorSpecilization() {
        const doctoSpecilize = await doctorModel.schema.path('specialization').enumValues;
        return doctoSpecilize;
    }

    async findDoctorByName(name) {
        const doctorDetails = await doctorModel.findOne({
            name: new RegExp(name, "i")
        });

        return doctorDetails;
    }

    async getHospitalForDoctor(doctorId) {
        return await chargesModel.find({ doctorId })
            .populate("hospitalId", "name location")
            .lean();
    }




}

export default new DoctorService();