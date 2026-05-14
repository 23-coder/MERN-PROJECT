import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'])

const getResourceType = (url) => {
    const ext = url.split('.').pop().toLowerCase().split('?')[0]
    return VIDEO_EXTENSIONS.has(ext) ? 'video' : 'image'
}

const safeUnlink = (filePath) => {
    if (!filePath) return
    try {
        fs.unlinkSync(filePath)
    } catch (e) {
        console.warn('Could not delete temp file:', e.message)
    }
}

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null
    // Re-apply config at call time — env vars may not be ready at module load in ESM
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        safeUnlink(localFilePath)
        return response
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message || error)
        safeUnlink(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (cloudinaryUrl, resourceType) => {
    if (!cloudinaryUrl) return null
    try {
        const type = resourceType || getResourceType(cloudinaryUrl)
        const urlParts = cloudinaryUrl.split("/")
        const uploadIndex = urlParts.indexOf("upload")
        if (uploadIndex === -1) return null

        const afterUpload = urlParts.slice(uploadIndex + 2).join("/")
        const publicId = afterUpload.replace(/\.[^/.]+$/, "")

        return await cloudinary.uploader.destroy(publicId, { resource_type: type })
    } catch (error) {
        console.error("Cloudinary delete failed:", error.message || error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }
