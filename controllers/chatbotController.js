import { chatbotLogic } from "../Services/chatbotLogic.js";

export const handleChatMessage = async (req, res) => {
    try {
        const { message, patientName } = req.body;

        if (!message || !patientName) {
            return res.status(400).json({ error: "Message and patientName are required." });
        }

        const botReply = await chatbotLogic(message, patientName);

        res.status(200).json({ reply: botReply });
    } catch (err) {
        console.error("Chatbot Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}