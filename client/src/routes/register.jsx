import { createFileRoute } from "@tanstack/react-router";
import Register from "../Pages/Register";

export const Route = createFileRoute("/register")({
  component: Register,
});