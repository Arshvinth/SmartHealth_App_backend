import express from "express";
import { cancelAppointment, getUserAppointments, scheduleAppointment } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/book", scheduleAppointment);
appointmentRouter.put("/cancel/:appointmentId", cancelAppointment);
appointmentRouter.get("/getAppointment/:userId", getUserAppointments);

export default appointmentRouter;