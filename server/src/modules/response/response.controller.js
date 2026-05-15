import * as responseService from "./response.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import { getIo } from "../../common/config/socket.js";

const submitVote = async (req, res, next) => {
      try {
            const { pollId } = req.params;

            const userId = req.user ? req.user._id : null;

            const response = await responseService.submitVote(pollId, userId, req.body);

            // socket 
            const io = getIo();

            io.to(pollId).emit("voteUpdated", {
                  message: "New vote received!",
                  pollId: pollId,
                  newVote: response
            });

            return ApiResponse.created(res, "Vote submitted successfully", response);
      } catch (error) {
            next(error);
      }
};

export { submitVote };