/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <>
        {/* Global Navigation Bar */}
        <nav className="p-4 flex gap-4 bg-primary text-white shadow-md">
          <Link to="/" className="[&.active]:font-bold text-lg">
            Home
          </Link>
        </nav>

        {/* Main Content Scope */}
        <main className="p-4 max-w-6xl mx-auto">
          <Outlet />
        </main>
        <Toaster position="top-right" reverseOrder={false} />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    </AuthProvider>
  ),
});
