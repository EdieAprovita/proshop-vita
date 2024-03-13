import dontenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import { errorHandler, notFound } from "./middleware/errorHandler";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productsRoutes";

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
app.use("/api/v1/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
