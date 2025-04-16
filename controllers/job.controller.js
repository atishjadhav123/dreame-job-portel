import { Job } from "../models/Job.model.js"


export const postJob = async (req, res) => {
    try {
        const { title, desc, requirements, salary, location, jobtype, position, experience, company, created_by } = req.body
        // console.log("req.body", req.body)

        const userid = req.id
        if (!title || !desc || !requirements || !salary || !location || !jobtype || !position || !experience || !created_by) {
            return res.status(400).json({ message: "Somthing is mising" })
        }
        const job = await Job.create({
            title,
            desc,
            requirement: requirements.split(","),
            salary: Number(salary),
            location,
            jobtype,
            experiencelevel: experience,
            position,
            company,
            created_by: userid
        })

        res.status(201).json({
            message: "new job created successfully",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}
export const getAllJob = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { desc: { $regex: keyword, $options: "i" } },
            ]
        }
        const jobs = await Job.find().populate('company')
        if (!jobs) {
            res.status(404).json({
                message: "job not found",
                success: false
            })
        }
        // console.log("jobs from get jobs", jobs)

        res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}
export const jobById = async (req, res) => {
    try {
        const jobid = req.params.id
        const job = await Job.findById(jobid).populate({
            path: "aplications"
        })
        if (!job) {
            res.status(404).json({
                message: "job not found",
                success: false
            })
        }
        res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}
export const getAdminJob = async (req, res) => {
    try {
        const adminid = req.id
        const jobs = await Job.find({ created_by: adminid })
        if (!jobs) {
            return res.status(404).json({
                message: "job not found",
                success: false
            })
        }
        res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}