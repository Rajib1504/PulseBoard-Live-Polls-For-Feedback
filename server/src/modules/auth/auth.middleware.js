import User from "./auth.model.js";
import jwt from "jsonwebtoken";
import ApiError from '../../common/utils/api-error.js';


const verifyJWT = async (req, res, next) => {
      try {
            const token = req.header("Authorization")?.replace("Bearer ", "");

            if (!token) throw ApiError.unauthorized("Not authenticated")

            const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            const user = await User.findById(decodeToken._id).select("-password -refreshToken")

            if (!user) {
                  throw ApiError.unauthorized("Invalid Access Token or User does not exist");
            }
            req.user = user;
            next()


      } catch (error) {

            if (error.name === "TokenExpiredError") {
                  next(ApiError.unauthorized("Token has expired. Please log in again."));
            } else if (error.name === "JsonWebTokenError") {
                  next(ApiError.unauthorized("Invalid token."));
            } else {
                  next(error);
            }
      }
}

export default verifyJWT;