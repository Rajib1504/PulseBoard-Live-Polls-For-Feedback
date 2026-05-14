import { Poll } from "./poll.model.js"


const createPoll = async (pollData, creatorId) => {
      const payload = {
            ...pollData,
            creator: creatorId
      }
      const poll = await Poll.create(payload)
      return poll;
}
export { createPoll }