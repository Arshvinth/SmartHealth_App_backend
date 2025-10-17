import express from "express";
import { getPaymentBreakdown } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/breakdown", getPaymentBreakdown);

export default router;
