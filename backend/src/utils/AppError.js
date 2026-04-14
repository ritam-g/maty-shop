/**
 * Custom error class for handling application-specific errors
 * Extends the built-in Error class with additional properties for HTTP error handling
 */
export class AppError extends Error {
    /**
     * Creates an instance of AppError
     * @param {string} message - The error message
     * @param {number} statusCode - The HTTP status code (e.g., 400, 404, 500)
     * @property {string} status - 'fail' for 4xx errors, 'error' for 5xx errors
     * @property {boolean} isOperational - Indicates if this is an operational error (true) or programming error (false)
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
