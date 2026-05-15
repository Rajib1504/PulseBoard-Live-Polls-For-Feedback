import * as pollService from "./poll.service.js"
import ApiResponse from './../../common/utils/api-response.js';

const createPoll = async (req, res, next) => {
      try {
            const poll = await pollService.createPoll(req.body, req.user._id)
            return ApiResponse.created(res, "Poll created successfully", poll);
      } catch (error) {
            next(error)
      }
}

const getAllPolls = async (req, res, next) => {
      try {
            const polls = await pollService.getPolls();
            return ApiResponse.ok(res, "Active polls fetched successfully", polls);
      } catch (error) {
            next(error);
      }
};

const getPollById = async (req, res, next) => {
      try {
            const { pollId } = req.params;
            const pollData = await pollService.getPollById(pollId);
            return ApiResponse.ok(res, "Poll details fetched successfully", pollData);
      } catch (error) {
            next(error);
      }
};
export { createPoll, getAllPolls, getPollById }