import express from 'express';
import dotenv from 'dotenv';
import chatRoutes from "./routes/chat.js"

dotenv.config();


// Initialization
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('../QuickLink'))

// Routes
app.use("/chat", chatRoutes);

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});