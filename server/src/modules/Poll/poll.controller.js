import * as pollService from "./poll.service.js"
import ApiResponse from './../../common/utils/api-response.js';

const createPoll = async (req, res, next) => {
      try {
            const poll = await pollService.pollCreate(req.body, req.user._id)
            return ApiResponse.created(res, "Poll created successfully", poll);
      } catch (error) {
            next(error)
      }
}
export { createPoll }