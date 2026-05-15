import { createFileRoute } from "@tanstack/react-router";
import PollDetail from "../../Pages/PollDetail";

export const Route = createFileRoute("/polls/$pollId/")({
  component: PollDetail,
});
