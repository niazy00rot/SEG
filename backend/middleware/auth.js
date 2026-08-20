const jwt = require("jsonwebtoken");
const { get_user_role } = require("../service/users.js");

function authorize_roles(...allowedRoles) {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.session;

            if (!token) {   
                return res.status(401).json({error: "Not authenticated"});
            }

            const decoded = jwt.verify(token,process.env.jwt_secret);
            const userId = decoded.id;


            const role = await get_user_role(userId);

            if (role.error) {
                return res.status(404).json({error: role.error});
            }

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({error: "You do not have permission to access this resource"});
            }

            req.user = {id: userId,role};

            next();

        } 
        catch (err) {
            console.error("Authorization error:", err);
            return res.status(401).json({error: "Invalid or expired session"});
        }
    }
}

module.exports = {
    authorize_roles}