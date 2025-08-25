import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export const sendMessage = async (req, res) => {
    try {
        const userMessage = req.body.message; // Getting user input from a request
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
            // For the next dev, you can remove this block of code if you have enough credits on your side
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            }
        });

        res.json({ reply: response.text }); // Send back Gemini's response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};