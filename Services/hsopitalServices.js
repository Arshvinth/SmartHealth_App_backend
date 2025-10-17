import hospital from "../models/hospital.js";


class HospitalServices {

    async getHospitalDetails() {
        console.log("Querying database for doctors...");
        const hospital = await hospital.find();
        console.log("Database result:", hospital);
        return doctorDetails;
    }
}

export default new HospitalServices;