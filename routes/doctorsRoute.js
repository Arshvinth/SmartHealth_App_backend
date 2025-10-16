import express from "express";
import { getDoctorHospitals, getDoctors, getDoctorSpecilization } from "../controllers/doctorControls.js";

const doctorRoute = express.Router();

doctorRoute.get("/doctorsList", getDoctors);
doctorRoute.get("/doctorHospitals/:doctorId", getDoctorHospitals);
doctorRoute.get("/doctorSpecialization", getDoctorSpecilization);

export default doctorRoute;