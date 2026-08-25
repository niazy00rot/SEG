
function error_handler(req,res,next,err){
    console.error(err)
    return res.status(500).json({error: "Internal server error"});
}

function async_handler(fn){
    return(res,req,next)=>{
        Promise
            .resolve(fn(req,res,next))
            .catch(next)
    };
}


module.exports = {
    error_handler,
    async_handler
}