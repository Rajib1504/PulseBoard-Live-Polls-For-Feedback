import Joi from "joi";
import BaseDto from "../../../common/config/dto.js";

class SubmitResponseDto extends BaseDto {
      static schema = Joi.object({
            //fingerprint id should come from 
            deviceId: Joi.string().trim().required().messages({
                  "string.empty": "Device ID is required for secure voting",
                  "any.required": "Device ID is missing"
            }),
            
            // answer response must be an Array which will hold the objects
            answers: Joi.array().items(
                  Joi.object({
                        // Mongoose ObjectId mostly 24 charrecter
                        questionId: Joi.string().hex().length(24).required().messages({
                              "string.hex": "Invalid Question ID format",
                              "string.length": "Invalid Question ID format",
                              "string.empty": "Question ID is required"
                        }),
                        optionId: Joi.string().hex().length(24).required().messages({
                              "string.hex": "Invalid Option ID format",
                              "string.length": "Invalid Option ID format",
                              "string.empty": "Option ID is required"
                        })
                  })
            ).min(1).required().messages({
                  "array.min": "You must answer at least one question to submit a vote",
                  "any.required": "Answers array is required"
            })
      });
}

export default SubmitResponseDto;