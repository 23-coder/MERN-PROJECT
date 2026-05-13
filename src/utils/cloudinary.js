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
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        //console.log("file is uploaded on cloudinary ", response.url);
        try {
            fs.unlinkSync(localFilePath)
        } catch (unlinkError) {
            console.warn("Unable to delete temporary file after upload:", unlinkError.message || unlinkError)
        }
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error.message || error)
        try {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        } catch (unlinkError) {
            console.warn("Unable to delete temporary file after failed upload:", unlinkError.message || unlinkError)
        }
        return null;
    }
}



export {uploadOnCloudinary}