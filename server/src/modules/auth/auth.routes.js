import { Router } from "express"
import * as authController from "./auth.controller.js"
import validate from "../../common/middleware/validate.dto.js"
import RegisterDto from "./dto/register.dto.js"
import loginDto from "./dto/login.dto.js"



const AuthRouter = Router()

AuthRouter.post("/register", validate(RegisterDto), authController.Register)
AuthRouter.post("/login", validate(loginDto), authController.login)


export default AuthRouter