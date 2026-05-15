import { Plus, Share2, PieChart } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-t border-border dark:border-border-dark bg-white dark:bg-[#0B1120]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-heading dark:text-white mb-4">
            How PulseBoard Works
          </h2>
          <p className="text-lg text-body dark:text-muted max-w-2xl mx-auto">
            Go from idea to actionable insights in less than 60 seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
          
          <div className="relative text-center z-10 group">
            <div className="w-20 h-20 mx-auto bg-white dark:bg-card-dark rounded-full border-[6px] border-slate-50 dark:border-slate-900 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary/20 text-primary flex items-center justify-center">
                <Plus size={28} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-heading dark:text-white mb-3">
              1. Create
            </h3>
            <p className="text-body dark:text-muted leading-relaxed">
              Build your poll with custom questions, define options, and set rules like expiry times or anonymity.
            </p>
          </div>

          <div className="relative text-center z-10 group">
            <div className="w-20 h-20 mx-auto bg-white dark:bg-card-dark rounded-full border-[6px] border-slate-50 dark:border-slate-900 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center">
                <Share2 size={28} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-heading dark:text-white mb-3">
              2. Share
            </h3>
            <p className="text-body dark:text-muted leading-relaxed">
              Distribute your poll via a clean URL or let your audience scan the generated QR code to vote instantly.
            </p>
          </div>

          <div className="relative text-center z-10 group">
            <div className="w-20 h-20 mx-auto bg-white dark:bg-card-dark rounded-full border-[6px] border-slate-50 dark:border-slate-900 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center">
                <PieChart size={28} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-heading dark:text-white mb-3">
              3. Analyze
            </h3>
            <p className="text-body dark:text-muted leading-relaxed">
              Watch votes populate your dashboard in real-time, then export the charts directly as images.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
