import jwt from "jsonwebtoken";
import User from "./auth.model.js";

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (token) {
            const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            const user = await User.findById(decodeToken._id).select("_id");
            if (user) {
                req.user = user; 
            }
        }
        next();
    } catch (error) {
        next(); 
    }
};

export default optionalAuth;