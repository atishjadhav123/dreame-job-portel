import { User } from "../models/User.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
export const register = async (req, res) => {
    try {
        const { fullname, email, phonenumber, password, role } = req.body
        if (!fullname || !email || !phonenumber || !password || !role) {
            return res.status(400).json({ message: "somthing is missing", success: false })
        }

        const file = req.file
        let cloudResponce = null;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponce = await cloudinary.uploader.upload(fileUri.content, {
                folder: "dreamjob/profile"
            });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "user alredy exist this email", success: false })
        }
        const hashpassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullname,
            email,
            phonenumber,
            password: hashpassword,
            role,
            profile: {
                profilephoto: cloudResponce?.secure_url || "",
                public_id: cloudResponce?.public_id || ""
            }
        })
        res.status(200).json({
            message: "account is created successfully",
            user: newUser,
            success: true
        })
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
        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        return res.status(200).json({
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
        const { fullname, email, phonenumber, bio, skills } = req.body;

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "user not found", success: false });
        }

        if (!user.profile) {
            user.profile = {};
        }

        // 👇 MULTIPLE FILES HANDLE KARO
        const profileImage = req.files?.profileImage?.[0];
        const resume = req.files?.resume?.[0];

        // ===== PROFILE IMAGE =====
        if (profileImage) {
            // OLD DELETE
            if (user.profile.public_id) {
                await cloudinary.uploader.destroy(user.profile.public_id);
            }

            const fileUri = getDataUri(profileImage);

            const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "dreamjob/profile"
            });

            // ✅ SAVE BOTH
            user.profile.profilephoto = uploadResponse.secure_url;
            user.profile.public_id = uploadResponse.public_id;
        }
        ;
        // ===== RESUME =====
        if (resume) {
            const fileUri = getDataUri(resume);

            const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "dreamjob/resume",
                resource_type: "raw"
            });

            // ✅ ONLY RESUME
            user.profile.resume = uploadResponse.secure_url;
            user.profile.resume_public_id = uploadResponse.public_id; // optional best practice
        }

        // ===== OTHER FIELDS =====
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phonenumber) user.phonenumber = phonenumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        await user.save();

        return res.status(200).json({
            message: "profile updated successfully",
            user,
            success: true
        });

    } catch (error) {
        console.log("ERROR:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};