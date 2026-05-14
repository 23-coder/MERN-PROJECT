import multer from "multer"
import crypto from "crypto"
import path from "path"
import fs from "fs"
import { ApiError } from "../utils/ApiError.js"

const TEMP_DIR = "./public/temp"
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

const ALLOWED_MIME = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
])

// Ensure temp directory exists on startup
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, TEMP_DIR)
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        const randomName = crypto.randomBytes(16).toString('hex')
        cb(null, `${randomName}${ext}`)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.has(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new ApiError(400, `File type not allowed: ${file.mimetype}`), false)
        }
    }
})
