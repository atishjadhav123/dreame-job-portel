import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applyJobRoute from "./routes/aplication.route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));

app.use("/api/auth", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/apply", applyJobRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "dist")))

// SPA fallback route
// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✌ Mongo connected");
        app.listen(process.env.PORT || 5000, () =>
            console.log(`✔ Server running at port ${process.env.PORT || 5000}`)
        );
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
