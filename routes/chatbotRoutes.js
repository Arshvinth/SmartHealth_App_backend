import express from "express";
import { handleChatMessage } from "../controllers/chatbotController.js";

const chatRouter = express.Router();

chatRouter.post("/chatbotHandle", handleChatMessage);

export default chatRouter;