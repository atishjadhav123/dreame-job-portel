import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { applyJob, getAplicant, getappliedJob, updateStatus } from "../controllers/aplication.controller.js"
const router = express.Router()

router
    .post("/applyjob/:id", isAuthenticated, applyJob)
    .get("/getapplyjob", isAuthenticated, getappliedJob)
    .get("/:jobId/aplicants", isAuthenticated, getAplicant)
    .put("/status/:id/update", isAuthenticated, updateStatus)
export default router