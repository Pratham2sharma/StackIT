import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
//app.use(cookieParser());


app.listen(PORT, () => {
    console.log("Server is Running on http://localhost:" + PORT);
    //connectDB();
})
