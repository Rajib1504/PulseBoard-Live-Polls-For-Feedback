import { createFileRoute } from "@tanstack/react-router";
import Login from "../Pages/Login";

export const Route = createFileRoute("/login")({
  component: Login,
});
