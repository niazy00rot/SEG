
function error_handler(err, req, res, next) {
    console.error(err)
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({error: err.message || "Internal server error"})
}

function async_handler(fn){
    return(req,res,next)=>{
        Promise
            .resolve(fn(req,res,next))
            .catch(next)
    };
}


module.exports = {
    error_handler,
    async_handler
}