import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";
import { connectDB } from "./lib/db.js";
import quesansRoutes from "./auth/quesans.routes.js";
import adminRoutes from "./auth/admin.routes.js";
import notificationRoutes from "./auth/notification.routes.js";
import path from "path";

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/quesans", quesansRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("/{*splat}", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(PORT, () => {
    console.log("Server is Running on http://localhost:" + PORT);
    connectDB();
})
