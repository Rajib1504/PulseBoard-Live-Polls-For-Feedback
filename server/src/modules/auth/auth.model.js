
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const UserSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
            minlength: [3, "Name must be at least 3 characters long"],
            trim: true
      },
      email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  "Please fill a valid email address"
            ],
      },
      password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            lowerCase: true,
            trim: true,
            select: false,
      },
      refreshToken: {
            type: String,
            default: null
      }
}, { timestamps: true })

// password hasing function 
UserSchema.pre("save", async function () {
      if (!this.isModified("password")) return 
      this.password = await bcrypt.hash(this.password, 12)
})
// compare password 
UserSchema.methods.comparePassword = async function (inputPassword) {
      return await bcrypt.compare(inputPassword, this.password)
}

UserSchema.methods.generateAccessToken = function () {
      return jwt.sign(
            { _id: this._id, email: this.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
      );
};

UserSchema.methods.generateRefreshToken = function () {
      return jwt.sign(
            { _id: this._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
      );
};

const User = mongoose.model("User", UserSchema)
export default User;
