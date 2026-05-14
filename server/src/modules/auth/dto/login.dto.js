import Joi from "joi";
import BaseDto from "../../../common/config/dto.js";

class loginDto extends BaseDto {
      static schema = Joi.object({
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().min(8).required(),
      })
}
export default loginDto;