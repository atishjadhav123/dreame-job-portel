import { User } from "../models/User.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
export const register = async (req, res) => {
    try {
        const { fullname, email, phonenumber, password, role } = req.body
        // console.log(req.body)


        if (!fullname || !email || !phonenumber || !password || !role) {
            return res.status(400).json({ message: "somthing is missing", success: false })
        }

        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponce = await cloudinary.uploader.upload(fileUri.content)

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "user alredy exist this email", success: false })
        }
        const hashpassword = await bcrypt.hash(password, 10)

        await User.create({
            fullname,
            email,
            phonenumber,
            password: hashpassword,
            role,
            profile: {
                profilephoto: cloudResponce.secure_url
            }
        })
        res.status(200).json({ message: "accound is created successfyly", User, success: true })
    } catch (error) {
        console.log(error)
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({ message: "somthing is mising", success: false })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "encorect email or password", success: false })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "encorect email or password", success: false })

        }
        if (role !== user.role) {
            return res.status(400).json({ message: "accound doesn,t with currunt role match", success: false })
        }
        const tokenData = {
            userId: user._id,
        }
        const token = await jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: "1d" })

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            role: user.role,
            profile: {
                profilephoto: user.profile?.profilephoto || "",
                bio: user.profile?.bio || "",
                skills: user.profile?.skills || []
            },
            skills: user.skills
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" }).json({
            message: `welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfuly ",
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phonenumber, bio, skills } = req.body

        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponce = await cloudinary.uploader.upload(fileUri.content)



        let skillsArry
        if (skills) {
            skillsArry = skills.split(",")
        }
        const userId = req.id
        let user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "user not found", success: false })
        }
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phonenumber) user.phonenumber = phonenumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArry

        if (cloudResponce) {
            user.profile.resume = cloudResponce.secure_url
            user.profile.resumeorignalname = file.originalname
        }

        await user.save()


        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({ message: "profile update successfully", user, success: true })
    } catch (error) {
        console.log(error)

    }
}