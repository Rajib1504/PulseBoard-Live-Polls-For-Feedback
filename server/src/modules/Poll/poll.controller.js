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

const getMyPolls = async (req, res, next) => {
      try {
            const polls = await pollService.getMyPolls(req.user._id);
            return ApiResponse.ok(res, "Your polls fetched successfully", polls);
      } catch (error) {
            next(error);
      }
};

const getAnalytics = async (req, res, next) => {
      try {
            const { pollId } = req.params;
            const analytics = await pollService.getAnalytics(pollId, req.user._id);
            return ApiResponse.ok(res, "Poll analytics fetched successfully", analytics);
      } catch (error) {
            next(error);
      }
};

const togglePublishResults = async (req, res, next) => {
      try {
            const { pollId } = req.params;
            const poll = await pollService.togglePublishResults(pollId, req.user._id);
            const status = poll.isResultPublished ? "published" : "unpublished";
            return ApiResponse.ok(res, `Poll results ${status} successfully`, poll);
      } catch (error) {
            next(error);
      }
};

const getPublicResults = async (req, res, next) => {
      try {
            const { pollId } = req.params;
            const results = await pollService.getPublicResults(pollId);
            return ApiResponse.ok(res, "Poll results fetched successfully", results);
      } catch (error) {
            next(error);
      }
};

export { createPoll, getAllPolls, getPollById, getMyPolls, getAnalytics, togglePublishResults, getPublicResults }