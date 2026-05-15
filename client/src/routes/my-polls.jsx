import { createFileRoute } from "@tanstack/react-router";
import MyPolls from "../Pages/MyPolls";

export const Route = createFileRoute("/my-polls")({
  component: MyPolls,
});
