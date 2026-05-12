import { Router } from "express"
import * as authController from "./auth.controller.js"
import validate from "../../common/middleware/validate.dto.js"
import RegisterDto from "./dto/register.dto.js"



const AuthRouter = Router()

AuthRouter.post("/register",validate(RegisterDto), authController.Register)


export default AuthRouter