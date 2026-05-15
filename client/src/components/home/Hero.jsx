import { Link } from "@tanstack/react-router";
import { BarChart3, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative text-center py-20 lg:py-26 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary/10 text-primary dark:text-primary-light text-sm font-semibold mb-8 border border-primary/20 shadow-sm animate-fade-in">
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
        Poll Management Platform
      </div>

      <h1
        className="text-5xl lg:text-7xl font-extrabold tracking-tight text-heading dark:text-white leading-tight max-w-4xl mx-auto mb-6 animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        Create Polls.{" "}
        <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
          Get Answers Live.
        </span>
      </h1>

      <p
        className="text-lg lg:text-xl text-body dark:text-muted max-w-2xl mx-auto mb-10 animate-slide-up"
        style={{ animationDelay: "200ms" }}
      >
        The most powerful way to collect feedback. Build interactive polls with
        zero setup, share them via QR code, and watch results stream in
        real-time.
      </p>

      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
        style={{ animationDelay: "300ms" }}
      >
        {isAuthenticated ? (
          <Link
            to="/polls/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-xl shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            <Plus size={20} /> Create Your First Poll
          </Link>
        ) : (
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-xl shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            Get Started For Free <ArrowRight size={20} />
          </Link>
        )}
        <a
          href="#features"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-heading dark:text-white bg-white dark:bg-card-dark border-2 border-border dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
        >
          <BarChart3 size={20} /> Explore Features
        </a>
      </div>
    </section>
  );
}
