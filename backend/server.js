import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";
import { connectDB } from "./lib/db.js";
import quesansRoutes from "./auth/quesans.routes.js";

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/quesans", quesansRoutes);



app.listen(PORT, () => {
    console.log("Server is Running on http://localhost:" + PORT);
    connectDB();
})
