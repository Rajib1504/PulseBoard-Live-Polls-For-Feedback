import { createFileRoute } from "@tanstack/react-router";
import CreatePoll from "../../Pages/CreatePoll";

export const Route = createFileRoute("/polls/create")({
  component: CreatePoll,
});
