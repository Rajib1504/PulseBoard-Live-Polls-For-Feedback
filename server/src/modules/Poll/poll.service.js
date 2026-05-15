import { Response } from "../response/response.model.js";
import { Poll } from "./poll.model.js"


const createPoll = async (pollData, creatorId) => {
      const payload = {
            ...pollData,
            creator: creatorId
      }
      const poll = await Poll.create(payload)
      return poll;
}

const getPolls = async () => {
      const polls = await Poll.find({
            isPublished: true,
            expiresAt: { $gt: new Date() }
      }).select("-questions") // we dont need to show the questions in the options
            .populate("creator", "name")// only we need the name field 
            .sort({ createdAt: -1 })

      return polls
}

const getPollById = async (pollId) => {
      const poll = await Poll.findById(pollId).populate("creator", "name");
      if (!poll) {
            throw ApiError.notfound("Poll not found");
      }
      const totalVotes = await Response.countDocuments({ pollId });
      return {
            poll,
            totalVotes
      };
}
export { createPoll, getPolls, getPollById }