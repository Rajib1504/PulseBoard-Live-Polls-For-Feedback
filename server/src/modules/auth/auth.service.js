import User from "./auth.model.js"
import ApiError from './../../common/utils/api-error.js';
import crypto from "crypto";
import jwt from "jsonwebtoken";

const register = async ({ name, email, password }) => {
      //find if the user exist 
      //hash password was done in model page so before the password save this will be hashed
      // save user 
      //send respose
      const existing = await User.findOne({ email })
      if (existing) { throw ApiError.conflict("user with this email already exist") }

      const user = await User.create({ name, email, password })

      const UserResponse = user.toObject()
      delete UserResponse.password
      return UserResponse
}

const login = async ({ email, password }) => {
      // find user using the email 
      // validate the passowrd 
      // generate the tokens 
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
            throw  ApiError.notfound("User dose not exist ")
      }
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
            throw  ApiError.unauthorized("Invalid email or password")
      }
      const accessToken = user.generateAccessToken()
      const rawRefreshToken = user.generateRefreshToken()

      const hashRefreshToken = crypto.createHash("sha256").update(rawRefreshToken).digest("hex")

      user.refreshToken = hashRefreshToken
      await user.save({ validateBeforeSave: false })

      const userResponse = user.toObject()
      delete userResponse.password
      delete userResponse.refreshToken
      return { user: userResponse, accessToken, refreshToken: rawRefreshToken }

}
const refreshAccessToken = async (rawRefreshToken) => {
      if (!rawRefreshToken) {
            throw ApiError.unauthorized("Refresh token is required");
      }

      // Verify the JWT structure
      let decodedToken;
      try {
            decodedToken = jwt.verify(rawRefreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
            throw ApiError.unauthorized("Invalid or expired refresh token");
      }

      // Find user
      const user = await User.findById(decodedToken._id);
      if (!user) {
            throw ApiError.unauthorized("Invalid refresh token");
      }

      // Hash the incoming raw token to compare with DB
      const hashRefreshToken = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
      if (user.refreshToken !== hashRefreshToken) {
            throw ApiError.unauthorized("Refresh token has been revoked or is invalid");
      }

      // Generate new access token
      const newAccessToken = user.generateAccessToken();
      return newAccessToken;
};

export { register, login, refreshAccessToken };