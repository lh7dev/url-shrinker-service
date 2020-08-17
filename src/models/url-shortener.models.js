import mongoose from "mongoose";

const UrlRegistrySchema = new mongoose.Schema({
    originalUrl: {
        type:String,
        required: true,
        unique: true,
        index: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        idex: true,
    }
})

export const UrlRegistry = mongoose.model("UrlRegistry", UrlRegistrySchema);