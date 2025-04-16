import express from "express"
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { singleupload } from "../middlewares/multer.js";
const router = express.Router()

router
    .post("/register", singleupload, register)
    .post("/login", login)
    .delete("/logout", logout)
    .put("/profile/update", isAuthenticated, singleupload, updateProfile)

export default router