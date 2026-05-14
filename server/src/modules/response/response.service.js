import ApiError from "../../common/utils/api-error.js"
import { Poll } from "../Poll/poll.model.js"
import { Response } from "./response.model.js"


const submitVote = async (pollId, userId, voteData) => {
      const { deviceId, answers } = voteData

      const poll = await Poll.findById(pollId)
      if (!poll) {
            throw ApiError.notfound("Poll not found");
      }
      if (!poll.isPublished) {
            throw ApiError.forbidden("This poll is currently not active");
      }
      if (new Date() > poll.expiresAt) {
            throw ApiError.badRequest("This poll has already expired");
      }

      if (!poll.isAnonymous && !userId) {
        throw ApiError.unauthorized("This poll is restricted to logged-in users only. Please login to vote.");
    }

      const dynamicCheckQuery = { pollId }

      if (userId) {
            dynamicCheckQuery.voterId = userId
      } else {
            dynamicCheckQuery.deviceId = deviceId
      }
      const existingVote = await Response.find(dynamicCheckQuery)
      if (existingVote) {
            throw ApiError.conflict("You have already submitted your vote for this poll");
      }

      const payload = {
            pollId,
            voterId: userId || null, // if not login then null
            deviceId,
            answers
      };

      const newResponse = await Response.create(payload);
      return newResponse;
}
export { submitVote }