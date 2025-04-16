import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getAdminJob, getAllJob, jobById, postJob } from "../controllers/job.controller.js"
const router = express.Router()

router
    .post("/createpost", isAuthenticated, postJob)
    .get("/getjob", getAllJob)
    .get("/getadminjob", isAuthenticated, getAdminJob)
    .get("/getjobbyid/:id", isAuthenticated, jobById)

export default router