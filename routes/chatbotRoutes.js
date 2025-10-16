import express from "express";
import { handleChatMessage } from "../controllers/chatbotController";

const chatRouter = express.Router();

chatRouter.post("/chatbotHandle", handleChatMessage);

export default chatRouter;