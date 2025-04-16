import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getAdminJob, getAllJob, jobById, postJob } from "../controllers/job.controller.js"
const router = express.Router()

router.post("/createpost", isAuthenticated, postJob)
router.get("/getjob", getAllJob)
router.get("/getadminjob", isAuthenticated, getAdminJob)
router.get("/getjobbyid/:id", isAuthenticated, jobById)

export default router