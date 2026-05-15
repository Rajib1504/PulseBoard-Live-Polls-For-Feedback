import Hero from "../components/home/Hero";
import FeatureShowcase from "../components/home/FeatureShowcase";
import ActivePollsGrid from "../components/home/ActivePollsGrid";
import HowItWorks from "../components/home/HowItWorks";
import CtaFooter from "../components/home/CtaFooter";

export default function Home() {
  return (
    <div className="animate-fade-in flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <FeatureShowcase />
        <ActivePollsGrid />
        <HowItWorks />
      </main>
      <CtaFooter />
    </div>
  );
}
