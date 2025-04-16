
import mongoose from "mongoose"
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    requirements: [{ type: String }],
    salary: { type: Number, required: true },
    experiencelevel: { type: Number, required: true },
    location: { type: String, required: true },
    jobtype: { type: String, required: true },
    position: { type: Number, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    aplications: [{ type: mongoose.Schema.Types.ObjectId, ref: "aplication" }]
}, { timestamps: true })
export const Job = mongoose.model("job", jobSchema)