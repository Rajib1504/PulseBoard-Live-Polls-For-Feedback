import { BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border dark:border-border-dark p-5 bg-white dark:bg-card-dark mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-heading dark:text-white">
          <BarChart3 size={20} className="text-primary" />
          <span className="text-lg font-bold tracking-tight">PulseBoard</span>
        </div>

        <p className="text-muted text-sm text-center font-medium">
          &copy; {new Date().getFullYear()} PulseBoard. Built for Poll
          Management.
        </p>
      </div>
    </footer>
  );
}
