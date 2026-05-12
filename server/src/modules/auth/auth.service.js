import User from "./auth.model.js"
import ApiError from './../../common/utils/api-error.js';

const register = async ({ name, email, password }) => {
      //find if the user exist 
      //hash password was done in model page so before the password save this will be hashed
      // save user 
      //send respose
      const existing = await User.findOne({ email })
      if (existing) { throw new ApiError.conflict("user with this email already exist") }

      const user = await User.create({ name, email, password })

      const UserResponse = user.toObject()
      delete UserResponse.password
      return UserResponse
}

export {register} ;