const jwt =require('jsonwebtoken')

function get_id(token){
    try{
        const decoded = jwt.verify(token,process.env.jwt_secret);
        const id = decoded.id
        return id
    }
    catch(err){
        return null;
    }
}

module.exports={get_id}