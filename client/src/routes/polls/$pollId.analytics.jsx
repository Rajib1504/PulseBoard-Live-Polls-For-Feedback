import { createFileRoute } from "@tanstack/react-router";
import PollAnalytics from "../../Pages/PollAnalytics";

export const Route = createFileRoute("/polls/$pollId/analytics")({
  component: PollAnalytics,
});
