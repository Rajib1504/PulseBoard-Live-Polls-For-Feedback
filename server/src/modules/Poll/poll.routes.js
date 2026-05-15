
import { Router } from 'express';
import verifyJWT from '../auth/auth.middleware.js';
import validate from './../../common/middleware/validate.dto.js';
import CreatePollDto from './dto/create.poll.dto.js';
import * as pollController from "./poll.controller.js"

const pollRouter = Router()

pollRouter.post(
      "/create",
      verifyJWT,  // validate user login 
      validate(CreatePollDto),// validate poll data format
      pollController.createPoll
)
pollRouter.get(
      "/",
      pollController.getAllPolls
);
// my-polls must come BEFORE /:pollId so Express doesn't treat "my-polls" as a pollId
pollRouter.get(
      "/my-polls",
      verifyJWT,
      pollController.getMyPolls
);
pollRouter.get(
      "/:pollId",
      pollController.getPollById
);
pollRouter.get(
      "/:pollId/analytics",
      verifyJWT,
      pollController.getAnalytics
);
pollRouter.get(
      "/:pollId/results",
      pollController.getPublicResults
);
pollRouter.patch(
      "/:pollId/publish",
      verifyJWT,
      pollController.togglePublishResults
);

export default pollRouter;