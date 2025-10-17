import express from "express";
import { checkAvailability, getSchedules } from "../controllers/scheduleController.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/availability/:scheduleId", checkAvailability);
scheduleRouter.get("/doctorAvailability/:hospitalId/:doctorId", getSchedules)
export default scheduleRouter;