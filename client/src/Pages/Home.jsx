import { BarChart3, Zap, Users, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Zap,
    title: "Real-Time Results",
    desc: "Watch votes come in live with instant updates powered by WebSocket.",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Users,
    title: "Anonymous Voting",
    desc: "Let anyone vote without logging in — secure dedup via fingerprinting.",
    color: "from-primary to-primary-light",
    shadow: "shadow-primary/20",
  },
  {
    icon: Shield,
    title: "Duplicate Protection",
    desc: "Smart device fingerprinting ensures one vote per person, every time.",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="text-center py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary/10 text-primary dark:text-primary-light text-sm font-medium mb-6">
          <BarChart3 size={14} />
          Live Polling Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-heading dark:text-white leading-tight">
          Create Polls.{" "}
          <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
            Get Answers.
          </span>
          <br />
          In Real Time.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-body dark:text-muted max-w-2xl mx-auto leading-relaxed">
          Build interactive polls, share them with your audience, and watch
          results stream in live. Simple, fast, and beautifully designed.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/"
              className="px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Create a Poll
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started — It&apos;s Free
            </Link>
          )}
          <Link
            to="/"
            className="px-8 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Browse Polls
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-800 hover:border-primary/20 dark:hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg ${f.shadow} mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-heading dark:text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-body dark:text-muted leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
