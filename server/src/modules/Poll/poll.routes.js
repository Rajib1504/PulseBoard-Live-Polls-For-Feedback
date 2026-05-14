
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
      pollController.pollCreate
)

export default pollRouter;