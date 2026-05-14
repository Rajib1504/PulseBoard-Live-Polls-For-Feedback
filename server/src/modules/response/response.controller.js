import * as responseService from "./response.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const submitVote = async (req, res, next) => {
      try {
            const { pollId } = req.params;

            const userId = req.user ? req.user._id : null;

            const response = await responseService.submitVote(pollId, userId, req.body);

            return ApiResponse.created(res, "Vote submitted successfully", response);
      } catch (error) {
            next(error);
      }
};

export { submitVote };