import { Link } from "@tanstack/react-router";
import { Users, ShieldCheck, Globe, BarChart3 } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function PollCard({ poll }) {
  return (
    <Link
      to={`/polls/${poll._id}`}
      className="group block bg-white dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark hover:border-primary/30 dark:hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      {/* Color accent */}
      <div className="h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {poll.isAnonymous ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <ShieldCheck size={11} /> Anonymous
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
              <Globe size={11} /> Authenticated
            </span>
          )}
          <CountdownTimer expiresAt={poll.expiresAt} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-heading dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {poll.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border dark:border-border-dark">
          <span className="text-xs text-muted">
            by {poll.creator?.name || "Unknown"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            <BarChart3 size={12} /> Vote now →
          </span>
        </div>
      </div>
    </Link>
  );
}
