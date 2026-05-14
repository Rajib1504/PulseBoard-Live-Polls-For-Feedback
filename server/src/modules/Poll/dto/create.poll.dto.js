import Joi from "joi";
import BaseDto from './../../../common/config/dto.js';

class CreatePollDto extends BaseDto {
      static schema = Joi.object({
            title: Joi.string().trim().max(150).required().messages({
                  "string.empty": "Poll title cannot be empty",
                  "string.max": "Title cannot exceed 150 characters"
            }),
            
            isAnonymous: Joi.boolean().default(false),
            isPublished: Joi.boolean().default(true),
            
            expiresAt: Joi.date().greater("now").required().messages({
                  "date.greater": "Expiry date must be in the future",
                  "any.required": "Expiry date is required"
            }),
            
            questions: Joi.array().items(
                  Joi.object({
// questions validation
                        text: Joi.string().trim().required().messages({
                              "string.empty": "Question text is required"
                        }),
                        isRequired: Joi.boolean().default(true),
// options validation  
                        options: Joi.array().items(
                              Joi.object({
                                    text: Joi.string().trim().required().messages({
                                          "string.empty": "Option text cannot be empty"
                                    })
                              })
                        ).min(2).required().messages({
                              "array.min": "Each question must have at least 2 options"
                        })
                  })
            ).min(1).required().messages({
                  "array.min": "A poll must have at least 1 question"
            })
      });
}

export default CreatePollDto;