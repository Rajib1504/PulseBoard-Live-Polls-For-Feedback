import User from "./auth.model.js"
import ApiError from './../../common/utils/api-error.js';
import comparePassword from "./auth.model.js"
import crypto from "crypto"

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

export { register,login};