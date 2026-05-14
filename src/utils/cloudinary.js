import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        try {
            fs.unlinkSync(localFilePath)
        } catch (unlinkError) {
            console.warn("Unable to delete temporary file after upload:", unlinkError.message || unlinkError)
        }
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error.message || error)
        try {
            fs.unlinkSync(localFilePath)
        } catch (unlinkError) {
            console.warn("Unable to delete temporary file after failed upload:", unlinkError.message || unlinkError)
        }
        return null;
    }
}

const deleteFromCloudinary = async (cloudinaryUrl, resourceType = "image") => {
    try {
        if (!cloudinaryUrl) return null

        // Extract public_id from URL: .../upload/v<version>/<public_id>.<ext>
        const urlParts = cloudinaryUrl.split("/")
        const uploadIndex = urlParts.indexOf("upload")
        if (uploadIndex === -1) return null

        // Skip the version segment (v<number>) then join remaining parts, strip extension
        const afterUpload = urlParts.slice(uploadIndex + 2).join("/")
        const publicId = afterUpload.replace(/\.[^/.]+$/, "")

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        })

        return result
    } catch (error) {
        console.error("Cloudinary delete failed:", error.message || error)
        return null
    }
}


export {uploadOnCloudinary, deleteFromCloudinary}
