import ApiError from "../../common/utils/api-error.js";
import { Response } from "../response/response.model.js";
import { Poll } from "./poll.model.js"
import mongoose from "mongoose";


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

// get polls created by logged-in user
const getMyPolls = async (userId) => {
      const polls = await Poll.find({ creator: userId })
            .sort({ createdAt: -1 });

      // attach response count for each poll
      const pollsWithCounts = await Promise.all(
            polls.map(async (poll) => {
                  const responseCount = await Response.countDocuments({ pollId: poll._id });
                  return {
                        ...poll.toObject(),
                        responseCount
                  };
            })
      );

      return pollsWithCounts;
}

// analytics: question-wise summaries with option counts
const getAnalytics = async (pollId, userId) => {
      const poll = await Poll.findById(pollId).populate("creator", "name");
      if (!poll) {
            throw ApiError.notfound("Poll not found");
      }
      // only the creator can view analytics
      if (poll.creator._id.toString() !== userId.toString()) {
            throw ApiError.forbidden("Only the poll creator can view analytics");
      }

      const totalResponses = await Response.countDocuments({ pollId });

      // aggregation: count votes per option per question
      const optionCounts = await Response.aggregate([
            { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
            { $unwind: "$answers" },
            {
                  $group: {
                        _id: {
                              questionId: "$answers.questionId",
                              optionId: "$answers.optionId"
                        },
                        count: { $sum: 1 }
                  }
            }
      ]);

      // build question-wise summary
      const questionSummaries = poll.questions.map((question) => {
            const optionResults = question.options.map((option) => {
                  const match = optionCounts.find(
                        (oc) =>
                              oc._id.questionId.toString() === question._id.toString() &&
                              oc._id.optionId.toString() === option._id.toString()
                  );
                  return {
                        optionId: option._id,
                        text: option.text,
                        votes: match ? match.count : 0
                  };
            });

            const totalQuestionVotes = optionResults.reduce((sum, o) => sum + o.votes, 0);

            return {
                  questionId: question._id,
                  text: question.text,
                  isRequired: question.isRequired,
                  totalVotes: totalQuestionVotes,
                  options: optionResults.map((o) => ({
                        ...o,
                        percentage: totalQuestionVotes > 0
                              ? Math.round((o.votes / totalQuestionVotes) * 100)
                              : 0
                  }))
            };
      });

      return {
            poll: {
                  _id: poll._id,
                  title: poll.title,
                  creator: poll.creator,
                  isAnonymous: poll.isAnonymous,
                  isResultPublished: poll.isResultPublished,
                  expiresAt: poll.expiresAt,
                  createdAt: poll.createdAt
            },
            totalResponses,
            questionSummaries
      };
}

// toggle publish/unpublish results (creator only)
const togglePublishResults = async (pollId, userId) => {
      const poll = await Poll.findById(pollId);
      if (!poll) {
            throw ApiError.notfound("Poll not found");
      }
      if (poll.creator.toString() !== userId.toString()) {
            throw ApiError.forbidden("Only the poll creator can publish results");
      }

      poll.isResultPublished = !poll.isResultPublished;
      await poll.save({ validateBeforeSave: false });
      return poll;
}

// public results: anyone can view if creator published them
const getPublicResults = async (pollId) => {
      const poll = await Poll.findById(pollId).populate("creator", "name");
      if (!poll) {
            throw ApiError.notfound("Poll not found");
      }
      if (!poll.isResultPublished) {
            throw ApiError.forbidden("Results have not been published yet");
      }

      const totalResponses = await Response.countDocuments({ pollId });

      const optionCounts = await Response.aggregate([
            { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
            { $unwind: "$answers" },
            {
                  $group: {
                        _id: {
                              questionId: "$answers.questionId",
                              optionId: "$answers.optionId"
                        },
                        count: { $sum: 1 }
                  }
            }
      ]);

      const questionSummaries = poll.questions.map((question) => {
            const optionResults = question.options.map((option) => {
                  const match = optionCounts.find(
                        (oc) =>
                              oc._id.questionId.toString() === question._id.toString() &&
                              oc._id.optionId.toString() === option._id.toString()
                  );
                  return {
                        optionId: option._id,
                        text: option.text,
                        votes: match ? match.count : 0
                  };
            });

            const totalQuestionVotes = optionResults.reduce((sum, o) => sum + o.votes, 0);

            return {
                  questionId: question._id,
                  text: question.text,
                  totalVotes: totalQuestionVotes,
                  options: optionResults.map((o) => ({
                        ...o,
                        percentage: totalQuestionVotes > 0
                              ? Math.round((o.votes / totalQuestionVotes) * 100)
                              : 0
                  }))
            };
      });

      return {
            poll: {
                  _id: poll._id,
                  title: poll.title,
                  creator: poll.creator,
                  isAnonymous: poll.isAnonymous,
                  expiresAt: poll.expiresAt,
                  createdAt: poll.createdAt
            },
            totalResponses,
            questionSummaries
      };
}

export { createPoll, getPolls, getPollById, getMyPolls, getAnalytics, togglePublishResults, getPublicResults }