import multer from 'multer'

/**
 * Multer middleware configuration for handling file uploads
 * Stores files in memory as Buffer objects for further processing (e.g., upload to ImageKit)
 * 
 * @type {Object}
 * @property {Function} storage - Memory storage engine (files stored as Buffer in RAM)
 * @property {Object} limits - Upload limits configuration
 * @property {number} limits.fileSize - Maximum file size allowed (5MB)
 */
const storage = multer.memoryStorage({})

/**
 * Multer upload middleware instance
 * Use this middleware to handle file uploads in routes
 * 
 * @example
 * upload.array('images', 5) // Accept up to 5 files with field name 'images'
 */
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
})
