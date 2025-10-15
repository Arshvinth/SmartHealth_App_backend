import express from "express";
import { checkAvailability } from "../controllers/scheduleController.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/availability/:scheduleId", checkAvailability);

export default scheduleRouter;