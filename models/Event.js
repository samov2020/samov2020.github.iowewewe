import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    // uid: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    dates: { type: Array },
    editPassword: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models['Event'] || mongoose.model('Event', EventSchema);