export function globalErrorHandler(err, req, res, next) {
    const message = err.message || "Something went wrong"
    const statusCode = err.statusCode || 500
    const status = err.status || "error"
    res.status(statusCode).json({
        status,
        message
    })
}