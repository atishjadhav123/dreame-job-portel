import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getCompantById, getCompany, registercompany, updateCompany } from "../controllers/companay.controller.js"
import { singleupload } from "../middlewares/multer.js"
const router = express.Router()

router
    .post("/registercompany", isAuthenticated, registercompany)
    .get("/getcompany", isAuthenticated, getCompany)
    .get("/getbyid/:id", getCompantById)
    .put("/updatecompany/:id", isAuthenticated, singleupload, updateCompany)

export default router