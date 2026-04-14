/**
 * Global error handling middleware for Express
 * Processes errors and sends appropriate JSON response to the client
 * Handles both operational errors (AppError) and unhandled exceptions
 * 
 * @param {Error} err - The error object (may contain statusCode, status, message)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends JSON response with error status and message
 */
export function globalErrorHandler(err, req, res, next) {
    const message = err.message || "Something went wrong"
    const statusCode = err.statusCode || 500
    const status = err.status || "error"
    res.status(statusCode).json({
        status,
        message
    })
}
