import { Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CtaFooter() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Big CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-accent rounded-[2.5rem] p-10 sm:p-16 text-center shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to hear from your audience?
          </h2>
          <p className="text-primary-50 text-lg sm:text-xl mb-10 max-w-2xl mx-auto relative z-10 font-medium">
            Join developers, creators, and teams who use PulseBoard to make
            data-driven decisions every day.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/polls/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-primary bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                Create Free Poll <ArrowRight size={20} />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-primary bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                Sign Up for Free <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
