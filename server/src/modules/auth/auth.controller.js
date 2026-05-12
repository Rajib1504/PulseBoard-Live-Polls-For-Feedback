import * as authService from "./auth.service.js"
import ApiResponse from './../../common/utils/api-response.js';


const Register = async(req,res)=>{
const user = authService.register(req.body)
ApiResponse.created(
      res,
      "User created Successfully,Please Login",
      user
)
}

export{Register}