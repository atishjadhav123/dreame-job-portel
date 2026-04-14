import express from "express"
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { upload } from "../middlewares/multer.js";
const router = express.Router()

router.post("/register", upload, register)
router.post("/login", login)
router.delete("/logout", logout)
router.put("/profile/update", isAuthenticated, upload, updateProfile)

export default router