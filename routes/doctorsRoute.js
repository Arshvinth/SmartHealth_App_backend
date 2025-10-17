import express from "express";
import { getDoctorHospitals, getDoctors, getDoctorSpecilization, getDoctorSpecilizationReport } from "../controllers/doctorControls.js";

const doctorRoute = express.Router();

doctorRoute.get("/doctorsList", getDoctors);
doctorRoute.get("/doctorHospitals/:doctorId", getDoctorHospitals);
doctorRoute.get("/doctorSpecialization", getDoctorSpecilization);
doctorRoute.get("/doctorSpecialization", getDoctorSpecilizationReport);

export default doctorRoute;