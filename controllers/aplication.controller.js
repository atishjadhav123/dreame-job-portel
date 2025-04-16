import { Aplication } from "../models/Aplication.model.js"
import { Job } from "../models/Job.model.js"
export const applyJob = async (req, res) => {
    try {
        const userid = req.id
        const jobid = req.params.id
        if (!jobid) {
            return res.status(400).json({
                message: "job id is required",
                success: false
            })
        }
        const existingAplication = await Aplication.findOne({ job: jobid, aplicant: userid })
        if (existingAplication) {
            return res.status(400).json({
                message: "you have alredy apliyed for this job",
                success: false
            })
        }
        const job = await Job.findById(jobid)

        if (!job) {
            return res.status(404).json({ message: "job not found", success: false })
        }
        const newAplication = await Aplication.create({
            job: jobid,
            aplicant: userid
        })
        job.aplications.push(newAplication._id)
        await job.save()
        return res.status(200).json({ message: "Job applied succcessfully", success: true })
    } catch (error) {
        console.log(error)

    }
}

export const getappliedJob = async (req, res) => {
    try {
        const userid = req.id
        const aplication = await Aplication.find({ aplicant: userid }).sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "company",
                    options: { sort: { createdAt: -1 } },
                }
            })
        if (!aplication) {
            return res.status(404).json({ message: "no aplication", success: false })
        }
        return res.status(200).json({ aplication, success: true })

    } catch (error) {
        console.log(error)

    }
}
// show admin how applied 
export const getAplicant = async (req, res) => {
    try {
        const jobid = req.params.id
        const job = await Job.findById(jobid).populate({
            path: 'aplications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "aplicant"
            }
        })
        if (!job) {
            return res.status(404).json({ message: "job not found", success: false })
        }
        return res.status(200).json({ job, success: true })

    } catch (error) {

    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        const aplicationid = req.params.id
        if (!status) {
            return res.status(404).json({ message: "ststus is required", success: false })
        }

        const aplication = await Aplication.findOne({ _id: aplicationid })
        if (!aplication) {
            return res, status(404).json({
                message: "aplication is not found",
                success: false
            })
        }
        aplication.status = status.toLowerCase()
        await aplication.save()
        return res.status(200).json({ message: "Status upadet successfully" })
    } catch (error) {

    }
}