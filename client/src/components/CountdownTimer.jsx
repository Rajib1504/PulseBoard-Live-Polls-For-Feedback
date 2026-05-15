import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) setTimeLeft(`${days}d ${hours}h left`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m left`);
      else setTimeLeft(`${minutes}m ${seconds}s left`);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isExpired
          ? "text-error"
          : "text-amber-600 dark:text-amber-400"
      }`}
    >
      <Clock size={12} />
      {timeLeft}
    </span>
  );
}
