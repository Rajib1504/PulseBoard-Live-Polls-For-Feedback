import { createFileRoute } from "@tanstack/react-router";
import PublicResults from "../../Pages/PublicResults";

export const Route = createFileRoute("/polls/$pollId/results")({
  component: PublicResults,
});
