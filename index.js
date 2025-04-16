import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js";
import companayRoute from "./routes/company.route.js";
import jobroute from "./routes/job.route.js";
import apllyJob from "./routes/aplication.route.js";
dotenv.config({})

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOptions))
app.use("/api/auth", userRoute)
app.use("/api/company", companayRoute)
app.use("/api/job", jobroute)
app.use("/api/applay", apllyJob)

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("✌ mongo connected")
    app.listen(process.env.PORT, console.log(`✔ server running at port ${PORT}`)
    )
})
