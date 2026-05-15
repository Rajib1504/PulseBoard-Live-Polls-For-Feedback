import { Router } from "express"
import optionalAuth from "../auth/optional.middleware.js";
import validate from "../../common/middleware/validate.dto.js";
import SubmitResponseDto from "./dto/submit.response.dto.js";
import * as responseController from "./response.controller.js"; // Imported

const ResponseRouter = Router();
ResponseRouter.post(
      "/:pollId",
      optionalAuth,                 //user login or ananimous
      validate(SubmitResponseDto),  //check device id and answers 
      responseController.submitVote // save the vote
);
export default ResponseRouter;