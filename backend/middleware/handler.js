
function error_handler(err,req,res,next){
    console.error(err)
    return res.status(500).json({error: "Internal server error"});
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