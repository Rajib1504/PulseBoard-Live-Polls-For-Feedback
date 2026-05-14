import mongoose, { Schema } from "mongoose";



const optionSchema = new mongoose.Schema({
      text: {
            type: String,
            required: [true, "Option text is required"],
            trim: true
      }
})

const questionSchema = new mongoose.Schema({
      text: {
            type: String,
            required: [true, "Question text is required"],
            trim: true
      },
      isRequired: {
            type: Boolean,
            default: true,
      },
      options: {
            type: [optionSchema],
            validate: {
                  validator: function (optionsArray) {
                        return optionsArray.length >= 2;
                  },
                  message: "A question must have at least 2 options"
            }
      }

})

const pollSchema = new mongoose.Schema({

      title: {
            type: String,
            require: true,
            maxLength: [150, "Title cannot exceed 150 characters"],
            trim: true
      },
      creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
      },
      isAnonymous: {
            type: Boolean,
            default: false
      },
      isPublished: {
            type: Boolean,
            default: true
      },
      expiresAt: {
            type: Date,
            validate: {
                  validator: function (value) {
                        return value > new Date()
                  },
                  message: "Expiry date must be in the future"
            }
      },
      questions: {
            type: [questionSchema],
            validate: {
                  validator: function (questionsArray) {
                        questionsArray.length >= 1
                  },
                  message: "A poll must have at least 1 question"
            }
      }
}, { timestamps: true })

pollSchema.index({ creator: 1 });
pollSchema.index({ isPublished: 1, expiresAt: 1 })

export const Poll = mongoose.model("Poll", pollSchema) 