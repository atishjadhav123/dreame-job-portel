import { Company } from "../models/Company.model.js"
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const registercompany = async (req, res) => {
    try {
        const { companyName } = req.body
        if (!companyName) {
            return res.status(400).json({
                message: "company name is require",
                success: true
            })
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "you cant't register same comany ",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            userid: req.id
        })
        return res.status(200).json({ message: "compnay registered succesfully ", company, success: true })

    } catch (error) {
        console.log(error)

    }
}

export const getCompany = async (req, res) => {
    try {
        const userid = req.id //logged in company
        const companies = await Company.find({ userid })
        if (!companies) {
            return res.status(400).json({ message: "compnay not found", success: false })
        }
        return res.status(200).json({ companies, success: true })

    } catch (error) {
        console.log(error)
    }
}
export const getCompantById = async (req, res) => {
    try {
        const comanyId = req.params.id
        const company = await Company.findById(comanyId)
        if (!company) {
            return res.status(400).json({ message: "compnay not found", success: false })
        }
        return res.status(200).json({ company, success: true })


    } catch (error) {

    }
}

export const updateCompany = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "No form data received", success: false });
        }

        const { name, desc, website, location } = req.body;
        const file = req.file;

        const fileUri = getDataUri(file)
        const cloudresponce = await cloudinary.uploader.upload(fileUri.content)
        const logo = cloudresponce.secure_url

        const updateData = { name, desc, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        return res.status(200).json({
            message: "Company information updated",
            success: true,
            company,
        });
    } catch (error) {
        console.error("Update Company Error:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
