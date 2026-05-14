import mongoose from "mongoose";


const answerSchema = new mongoose.Schema({
      questionId: {
            type: Schema.Types.ObjectId,
            required: true
      },
      optionId: {
            type: Schema.Types.ObjectId,
            required: true
      }
}, { _id: false });// we dont need _id because it will only hold the data 

const responseSchema = new mongoose.Schema({
      pollId: {
            type: Schema.Types.ObjectId,
            ref: "Poll",
            required: true
      },
      // voterId optional for anonymous voting
      voterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
      },
      // if anonymous polling,then will hold fingerprint for stoping the dubble vote 
      deviceId: {
            type: String,
            required:function(){
                  return this.voterId === null
            }
      },
      answers: {
            type: [answerSchema],
            required: true,
            validate: {
                  validator: function (answersArray) {
                        return answersArray.length > 0;
                  },
                  message: "Response must contain at least one answer"
            }
      }
}, { timestamps: true });

export const Response = mongoose.model("Response", responseSchema)
