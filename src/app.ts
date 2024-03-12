import dontenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";

import userRoutes from "./routes/userRoutes";

dontenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/v1", (req, res) => {
	res.send("API is running...");
});

app.use("/api/v1/users", userRoutes);

export default app;
