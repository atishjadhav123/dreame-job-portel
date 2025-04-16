import mongoose from "mongoose"
const aplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "job", require: true },
    aplicant: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true })
export const Aplication = mongoose.model("aplication", aplicationSchema)