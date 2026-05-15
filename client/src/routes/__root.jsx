/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { Sun, Moon, LogOut, BarChart3 } from "lucide-react";
import Footer from "../components/Footer";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left side: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group w-1/4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
            <BarChart3 size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PulseBoard
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          <Link
            to="/"
            hash="features"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            Features
          </Link>
          <Link
            to="/"
            hash="how-it-works"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            How it Works
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-polls"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors [&.active]:text-primary"
            >
              My Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <div className="flex items-center gap-1">
            {/* Auth Buttons */}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light hover:bg-primary-50 dark:hover:bg-slate-800 transition-all duration-200 [&.active]:text-primary [&.active]:bg-primary-50 dark:[&.active]:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-slate-800">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-error hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 dark:text-sky-400 transition-all duration-300 hover:scale-105 active:scale-95"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
          <Navbar />
          <main className="flex-grow px-4 sm:px-6 max-w-6xl mx-auto py-8 w-full">
            <Outlet />
          </main>
          <Footer />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#1e293b",
                color: "#f1f5f9",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </ThemeProvider>
    </AuthProvider>
  ),
});
