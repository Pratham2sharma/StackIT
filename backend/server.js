import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes.js";
import { connectDB } from "./lib/db.js";
import quesansRoutes from "./auth/quesans.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/quesans", quesansRoutes);



app.listen(PORT, () => {
    console.log("Server is Running on http://localhost:" + PORT);
    connectDB();
})
