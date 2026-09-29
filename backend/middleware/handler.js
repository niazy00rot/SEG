
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
        this.name = 'AppError'
    }
}

function error_handler(err, req, res, next) {
    const statusCode = err.statusCode || 500

    if (statusCode >= 500) {
        console.error(JSON.stringify({
            event: 'http_error',
            method: req.method,
            path: req.originalUrl,
            statusCode,
            name: err.name,
            message: err.message,
            code: err.code,
            constraint: err.constraint,
            detail: err.detail,
            stack: err.stack
        }))
    }

    return res.status(statusCode).json({
        error: statusCode >= 500 ? "Internal server error" : err.message || "Request failed"
    })
}

function async_handler(fn){
    return(req,res,next)=>{
        Promise
            .resolve(fn(req,res,next))
            .catch(next)
    };
}


module.exports = {
    AppError,
    error_handler,
    async_handler
}