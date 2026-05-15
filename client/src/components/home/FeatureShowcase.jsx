import { QrCode, ImageDown, Zap, Fingerprint } from "lucide-react";

const showcaseFeatures = [
  {
    icon: QrCode,
    title: "Scan & Vote instantly",
    desc: "Generate a unique QR code for your poll with one click. Judges or audiences can simply point their phones to vote without typing any URLs.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-200 dark:border-indigo-500/20",
  },
  {
    icon: Zap,
    title: "Real-Time Magic",
    desc: "Watch the bar charts animate and grow the exact second someone submits a vote. Powered by Socket.IO for zero-latency updates.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  {
    icon: ImageDown,
    title: "Export Results to Image",
    desc: "Want to share the final decision on social media or a presentation? Export your beautiful analytics charts directly to a high-res PNG.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  {
    icon: Fingerprint,
    title: "Bulletproof Security",
    desc: "Anonymous polls shouldn't mean spam. Our smart device fingerprinting ensures every user only gets exactly one vote.",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
  },
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="py-20 border-t border-border dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">
            Pro Features Included
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-heading dark:text-white mb-4">
            Everything you need to run perfect polls
          </h3>
          <p className="text-lg text-body dark:text-muted max-w-2xl mx-auto">
            We built PulseBoard with advanced tools so you can focus on the data, not the logistics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {showcaseFeatures.map((feature, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border bg-white dark:bg-card-dark ${feature.border} shadow-sm hover:shadow-xl transition-all duration-300 group`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-heading dark:text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-body dark:text-muted leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
