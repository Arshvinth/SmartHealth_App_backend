import express from "express";
import { getDoctorHospitals, getDoctors } from "../controllers/doctorControls";

const doctorRoute = express.Router();

Router.get("/doctorsList", getDoctors);
Router.get("/doctorHospitals/:doctorId", getDoctorHospitals);

export default doctorRoute;