import * as pollService from "./poll.service"
import ApiResponse from './../../common/utils/api-response';

const pollCreate = async (req, res, next) => {
      try {
            const Poll = await pollService.pollCreate(req.body, req.user._id)
            return ApiResponse.created(res, "Poll created successfully", poll);
      } catch (error) {
            next(error)
      }
}
export { pollCreate }