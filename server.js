import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(2000, () => {
    console.log("Server running on port 2000");
});